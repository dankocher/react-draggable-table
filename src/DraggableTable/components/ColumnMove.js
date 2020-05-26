import React from 'react';
import "./ColumnMove.scss"

class ColumnMove extends React.Component {

    render() {

        const {data, columnEnd, itemWidth, columnPosition, headerHeight, topHandle, renderTopHeader,
                columnMove, rowHeight, renderItem, amountHeight, amountBackground, renderAmount, columnData} = this.props.props;

        return <div className={`--column-move`}
                    style={{
                        width: itemWidth+1, //columnEnd ? itemWidth+2 : itemWidth+1,
                        height: headerHeight + ((rowHeight+1) * data.length) + amountHeight + 1,
                        left: columnPosition}}>
            <div className="-top-header-container" style={{height: headerHeight}}>
                <div className="--top-header-item" style={{/*width: itemWidth/*columnEnd ? itemWidth+1 : itemWidth*/}}>
                    <div className="---handle"
                    >{topHandle}</div>
                    {renderTopHeader(columnData.header, columnMove)}
                </div>
            </div>
            <div className="-data-container" style={{height: rowHeight * data.length + data.length}}>
                {
                    data.map((items, r) =>
                        <div key={`row-container-${r}`} className="--row-container" style={{height: rowHeight+2}}>
                            {
                                <div className="--item" style={{width: columnEnd ? itemWidth+2 : itemWidth+1, height: rowHeight}}>
                                    {renderItem(columnData.data[r], columnMove)}
                                </div>
                            }
                        </div>

                    )
                }
            </div>
            <div className="-amount-container" style={{height: amountHeight, backgroundColor: amountBackground}}>
                <div className="--amount-item" style={{height: amountHeight}}>{renderAmount(columnData.amount, columnMove)}</div>
            </div>
        </div>
    }
}

export default ColumnMove;
