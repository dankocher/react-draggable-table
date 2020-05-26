import React from "react";
import './TopHeaderContainer.scss';
import clone from "../utils/clone";
import compareObjects from "../utils/compareObjects";

class TopHeaderContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            topHeader: clone(props.props.topHeader)
        }
    }

    getColumn = i => {
        const {topHeader, data, amount} = this.props.props;

        const column = {};
        column.header = topHeader[i];
        column.data = [];
        for (const row of data) {
            column.data.push(row[i]);
        }
        column.amount = amount[i];
        return column;
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.props.props.isDragging && (
            !compareObjects(this.props.props.topHeader, this.state.topHeader)
        )) {
            this.setState({
                topHeader: clone(this.props.props.topHeader)
            })
        }
    }

    render() {
        const {setState} = this.props;
        const {headerHeight, leftHeaderWidth, columnMove, itemWidth,
            topHandle, renderTopHeader, transformX} = this.props.props;

        const {topHeader} = this.state;

        const width = leftHeaderWidth + itemWidth * topHeader.length + 3;
        return (
            <div className="-top-header-container" style={{height: headerHeight, width}}>
                <div className="border-top-line" style={{left: leftHeaderWidth + 1, top: 0, width: width - leftHeaderWidth - 1}}/>
                {/*<div className="border-top-line" style={{left: leftHeaderWidth + 1, top: headerHeight-1, width: width - leftHeaderWidth - 1}}/>*/}
                <div className="empty-item" style={{width: leftHeaderWidth+1}}/>
                {
                    topHeader.map((h, i) => i === columnMove ?
                        <div key={`top-${i}`} className="--top-header-item --empty" style={{width: itemWidth, height: headerHeight, left: transformX[i]+1}}/>
                        :
                        <div key={`top-${i}`} className="--top-header-item" style={{width: itemWidth, left: transformX[i]+1}}>
                            <div className="---handle">
                                <div onMouseDown={el => setState({
                                    columnMove: i,
                                    columnData: this.getColumn(i),
                                    offsetMouseX: el.clientX,
                                    columnPosition: transformX[i]+1,
                                    columnEnd: i === topHeader.length-1})}>
                                    {topHandle}
                                </div>
                            </div>
                            {renderTopHeader(h, i)}
                        </div>)
                }
            </div>
        )
    }
}

export default TopHeaderContainer;
