import React from "react";
import './DataContainer.scss';
import clone from "../utils/clone";
import compareObjects from "../utils/compareObjects";

class DataContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: clone(props.props.data),
            leftHeader: clone(props.props.leftHeader)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.props.props.isDragging &&
            (
                !compareObjects(this.props.props.leftHeader, this.state.leftHeader) ||
                !compareObjects(this.props.props.data, this.state.data))
        ) {
            this.setState({data: clone(this.props.props.data), leftHeader: clone(this.props.props.leftHeader)});
        }
    }

    render() {
        const {setRef, setRowRef, setState} = this.props;
        const {rowHeight, itemWidth, leftHeaderWidth, leftHandle, renderLeftHeader, columnMove, renderItem,
            rowMove, rowPosition, rows, rowMoveData, transformX, topHeader} = this.props.props;

        const {data, leftHeader} = this.state;

        const width = leftHeaderWidth + ((itemWidth) * topHeader.length) + 1;

        return (
            <div className="-data-container" ref={dataContainer => setRef(dataContainer)} style={{height: leftHeader.length * (rowHeight+2) - leftHeader.length, width}}>
                {
                    data.map((items, r) => (
                         <div key={`row-container-${r}`} className={`--row-container${r === rowMove ? ' -moving-hidden' : ""}`}
                             style={{
                                 height: rowHeight+2,
                                 width: width,
                                 transform: `translateY(-${r+1}px)`
                                 // top: (r * rowHeight) - r - 2
                             }}
                             ref={row => {setRowRef(row, r)}}
                        >
                            {
                                r === rowMove ? <div style={{height: rowHeight}}/> :
                                    <>
                                        <div className="--left-header" style={{width: leftHeaderWidth, height: rowHeight}}>
                                            <div onMouseDown={el => setState({
                                                rowMove: r,
                                                offsetMouseY: el.clientY,
                                                rowPosition: rows[r].offsetTop-r-1,
                                                rowMoveData: {header: leftHeader[r], data: items}
                                            })}>
                                                {leftHandle}
                                            </div>
                                            {renderLeftHeader(leftHeader[r], r)}
                                        </div>
                                        {items.map((item, i) => i === columnMove ?
                                            <div key={`item-${i}`} className="--item --empty"
                                                 style={{width: itemWidth, height: rowHeight, left: transformX[i]}}/>
                                            :
                                            <div key={`item-${i}`} className="--item" style={{width: itemWidth, left: transformX[i]}}>
                                                {renderItem(item, i)}
                                            </div>)}
                                    </>
                            }
                        </div>
                    ))
                }

                {   rowMove === null ? null :
                    <div className="--row-container -move" style={{top: rowPosition, height: rowHeight+2, width: width}}>
                        <div className="--left-header" style={{width: leftHeaderWidth, height: rowHeight}}
                        >
                            {leftHandle}
                            { renderLeftHeader(rowMoveData.header, rowMove) }
                        </div>
                        {rowMoveData.data.map((item, i) =>
                            <div key={`item-${i}`} className="--item" style={{width: itemWidth, height: rowHeight, left: transformX[i]}}>
                                {renderItem(item, i)}
                            </div>)
                        }
                    </div>
                }

            </div>
        )
    }
};

export default DataContainer;
