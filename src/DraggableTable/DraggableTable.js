import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './styles.scss';
import ColumnMove from "./components/ColumnMove";
import AmountContainer from "./components/AmountContainer";
import DataContainer from "./components/DataContainer";
import TopHeaderContainer from "./components/TopHeaderContainer";
import getTranslateY from "./utils/getTranslateY";
import toTranslateY from "./utils/toTranslateY";
import arrayMove from "./utils/arrayMove";
import clone from "./utils/clone";
import matrixMove from "./utils/matrixMove";
import compareObjects from "./utils/compareObjects";

class DraggableTable extends Component {

    static propTypes = {
        topHeader: PropTypes.array.isRequired,
        leftHeader: PropTypes.array.isRequired,
        data: PropTypes.array.isRequired,
        renderItem: PropTypes.func.isRequired,
        renderTopHeader: PropTypes.func.isRequired,
        renderLeftHeader: PropTypes.func.isRequired,
        renderAmount: PropTypes.func.isRequired,
        leftHeaderWidth: PropTypes.number.isRequired,
        itemWidth: PropTypes.number.isRequired,
        rowHeight: PropTypes.number.isRequired,
        headerHeight: PropTypes.number.isRequired,
        leftHandle: PropTypes.object,
        topHandle: PropTypes.object,
        amountText: PropTypes.string,
        amountBackground: PropTypes.string,
        amount: PropTypes.array,
        amountHeight: PropTypes.number,
        setRows: PropTypes.func.isRequired,
        setColumns: PropTypes.func.isRequired,

        horizontalArrow: PropTypes.string,
        verticalArrow: PropTypes.string

    };


    constructor(props) {
        super(props);

        const transformX = [];
        for (let i=0; i < props.topHeader.length; i++) {
            transformX.push(props.leftHeaderWidth + i * props.itemWidth);
        }

        this.state = {
            rowMove: null,
            rowMoveData: null,
            rowPosition: 0,
            offsetMouseY: 0,

            columnMove: null,
            columnData: {},
            columnMoveData: null,
            columnPosition: props.leftHeaderWidth,
            offsetMouseX: 0,
            transformX,
            columnEnd: false,

            animate: true,
            moved: 0
        };

        this.data = clone(props.data);
        this.leftHeader = clone(props.leftHeader);
        this.topHeader = clone(props.topHeader);
        this.amount = clone(props.amount);
    }

    table = null;
    dataContainer = null;
    rows = [];
    moved = 0;
    lastPosition = null;

    moveRow = (clientY) => {
        if (this.lastPosition === null) this.lastPosition = this.state.rowMove;
        if (this.state.rowMove !== null) {
            const {rowMove, offsetMouseY} = this.state;
            const {rowHeight} = this.props;
            let y = clientY - offsetMouseY + rowMove * rowHeight;
            let rowPosition = y;
            const max = this.dataContainer.offsetHeight - rowHeight-2;
            if (y < 0) {
                rowPosition = -1
            } else if (y > max) {
                rowPosition = max;
            }
            this.setState({rowPosition});

            //Move column to new position (Only animation before mouseUp)
            const floatPosition = (rowPosition / rowHeight);
            let newPosition = parseInt(floatPosition);
            const difPosition = floatPosition - newPosition;
            if (difPosition > 0.5) {
                newPosition++;
            }

            let translateY = -rowMove;

            if (newPosition > rowMove) {
                translateY = (newPosition * rowHeight) - newPosition-1;
            } else if (newPosition < rowMove) {
                translateY = -((rowMove - newPosition) * rowHeight) + newPosition-1;
            }

            const movePX = rowHeight+1;

            if (getTranslateY(this.rows[rowMove]) !== translateY) {
                let rowMovePXPosition = getTranslateY(this.rows[rowMove]);
                let lastPXPosition = getTranslateY(this.rows[this.lastPosition]);
                let newPXPosition = getTranslateY(this.rows[newPosition]);
                if (this.lastPosition < newPosition) {
                    this.rows[rowMove].style.transform = toTranslateY(rowMovePXPosition + movePX);
                    if (newPosition <= rowMove) {
                        this.rows[this.lastPosition].style.transform = toTranslateY(lastPXPosition - movePX);
                    } else {
                        this.rows[newPosition].style.transform = toTranslateY(newPXPosition - movePX);
                    }
                    arrayMove(this.data, newPosition-1, newPosition);
                    arrayMove(this.leftHeader, newPosition-1, newPosition);
                } else if (this.lastPosition > newPosition) {
                    this.rows[rowMove].style.transform = toTranslateY(rowMovePXPosition - movePX);
                    if (newPosition >= rowMove) {
                        this.rows[this.lastPosition].style.transform = toTranslateY(lastPXPosition + movePX);
                    } else {
                        this.rows[newPosition].style.transform = toTranslateY(newPXPosition + movePX);
                    }
                    arrayMove(this.data, newPosition, newPosition+1);
                    arrayMove(this.leftHeader, newPosition, newPosition+1);
                }
            }

            this.lastPosition = newPosition;
        }
    };

    moveColumn = (clientX) => {
        const {itemWidth, leftHeaderWidth} = this.props;
        const {columnMove, transformX, offsetMouseX} = this.state;

        if (this.lastPosition === null) this.lastPosition = columnMove;

        if (columnMove !== null) {
            let x = clientX - offsetMouseX + leftHeaderWidth + (columnMove * itemWidth);
            let columnPosition = x;
            const max = this.dataContainer.offsetWidth - itemWidth - 1;
            if (x < leftHeaderWidth+1) {
                columnPosition = leftHeaderWidth+1
            } else if (x >= max) {
                columnPosition = max;
            }

            this.setState({columnPosition, columnEnd: columnPosition === max});

            const floatPosition = ((columnPosition-leftHeaderWidth) / (itemWidth));
            let newPosition = parseInt(floatPosition);
            const difPosition = floatPosition - newPosition;
            if (difPosition >= 0.5) {
                newPosition++;
            }
            const movePX = leftHeaderWidth + (itemWidth * newPosition);

            if (transformX[columnMove] !== movePX) {

                let columnMovePxPosition = transformX[columnMove];

                if (this.lastPosition < newPosition) {
                    transformX[columnMove] = transformX[columnMove] + itemWidth;
                    if (newPosition <= columnMove) {
                        transformX[this.lastPosition] = columnMovePxPosition
                    } else {
                        transformX[newPosition] = columnMovePxPosition;
                    }
                    arrayMove(this.topHeader, newPosition-1, newPosition);
                    arrayMove(this.amount, newPosition-1, newPosition);
                    this.data = matrixMove(this.data, newPosition-1, newPosition);
                } else if (this.lastPosition > newPosition) {
                    transformX[columnMove] = transformX[columnMove] - itemWidth;

                    if (newPosition >= columnMove) {
                        transformX[this.lastPosition] = columnMovePxPosition;
                    } else {
                        transformX[newPosition] = columnMovePxPosition;
                    }
                    arrayMove(this.topHeader, newPosition, newPosition+1);
                    arrayMove(this.amount, newPosition, newPosition+1);
                    this.data = matrixMove(this.data, newPosition, newPosition+1);
                }

                this.setState({transformX});

                this.lastPosition = newPosition;
            }


        }
    };

    componentDidMount() {
        window.document.onmousemove = el => {
            if (this.state.rowMove !== null) {
                this.moveRow( el.clientY)
            } else if (this.state.columnMove !== null) {
                this.moveColumn(el.clientX)
            }
        };

        window.document.onmouseup = el => {
            if (this.state.rowMove !== null || this.state.columnMove !== null) {
                this.rows = [];
                this.lastPosition = null;
                // this.setState({animate: false});
                this.setState({animate: false});
                if (this.state.rowMove !== null) {
                    this.props.setRows(this.leftHeader, this.data);
                    for (let i = 0; i < this.rows.length; i++) {
                        this.rows[i].style.transform = `translateY(${-i - 1}px)`;
                    }
                } else if (this.state.columnMove !== null) {
                    // console.log(this.data);
                    this.props.setColumns(this.topHeader, this.data, this.amount);
                    const transformX = [];
                    for (let i=0; i < this.props.topHeader.length; i++) {
                        transformX.push(this.props.leftHeaderWidth + i * this.props.itemWidth);
                    }
                    this.setState({transformX});
                }
                this.setState({rowMove: null, columnMove: null, rowMoveData: null, columnMoveData: null});

                // console.log("set", this.leftHeader);

                setTimeout(() => this.setState({animate: true}), 500);
            }
        };


    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ( compareObjects(prevProps.data, this.data) && !compareObjects(this.data, this.props.data)) {
            this.data = clone(this.props.data);
        }
        if ( compareObjects(prevProps.leftHeader, this.leftHeader) && !compareObjects(this.leftHeader, this.props.leftHeader)) {
            this.leftHeader = clone(this.props.leftHeader);
        }
        if ( compareObjects(prevProps.topHeader, this.topHeader) && !compareObjects(this.topHeader, this.props.topHeader)) {
            this.topHeader = clone(this.props.topHeader);
        }
        if ( compareObjects(prevProps.amount, this.amount) && !compareObjects(this.amount, this.props.amount)) {
            this.amount = clone(this.props.amount);
        }
    }

    render() {
        const {renderTopHeader, renderItem, headerHeight,
            leftHeaderWidth, itemWidth, renderLeftHeader, leftHandle, topHandle, rowHeight,
            amount, amountText, amountHeight, amountBackground, topHeader, data, leftHeader, renderAmount,
            horizontalArrow, verticalArrow} = this.props;

        const {rowMove, columnMove, rowPosition, rowMoveData, columnPosition, columnEnd, animate, moved, transformX, columnData} = this.state;

        const tableWidth = leftHeaderWidth + itemWidth * topHeader.length + 3;

        const isDragging = columnMove !== null || rowMove !== null;

        return (
            <div className="r-draggable-table">
                { horizontalArrow === undefined ? null :
                    <div className="-h-arrow" style={{paddingLeft: leftHeaderWidth}}>
                        {horizontalArrow}
                        <div className="h-arr" style={{width: tableWidth - leftHeaderWidth}}/>
                        <HorizontalArrow width={tableWidth - leftHeaderWidth} height={35}/>
                    </div>
                }
                <div className="draggable-table-c">
                    { verticalArrow === undefined ? null :
                        <div className="-v-arrow" style={{paddingTop: headerHeight+1}}>
                            <div className="text">{verticalArrow}</div>
                            <VerticalArrow width={35} height={amountHeight + leftHeader.length * rowHeight + leftHeader.length + 1}/>
                        </div>
                    }
                    <div className={`draggable-table${animate ? "" : ' --na'}`} ref={table => this.table = table}
                         style={{width: tableWidth, userSelect: isDragging ? 'none' : 'unset'}} >

                        <div className="table-container">
                            <TopHeaderContainer props={{headerHeight, leftHeaderWidth, topHeader, columnMove, itemWidth, topHandle, renderTopHeader, transformX, data, amount, isDragging}}
                                                transformX={transformX}
                                                columnMove={columnMove}
                                                setState={s => this.setState({...s})}
                            />

                            <DataContainer props={{data, rowHeight, itemWidth, leftHeaderWidth, leftHandle, renderLeftHeader, leftHeader, columnMove, renderItem, rowMove, moved, rowPosition, rowMoveData, transformX, topHeader, rows: this.rows, isDragging}}
                                           setRef={dataContainer => this.dataContainer = dataContainer}
                                           setRowRef={(row, r) => this.rows[r] = row}
                                           setState={s => this.setState({...s})}
                            />

                            <AmountContainer props={{amountHeight, amountBackground, leftHeaderWidth, amountText, amount, itemWidth, columnMove, transformX, renderAmount, isDragging}}/>

                            {
                                columnMove === null ? null :
                                    <ColumnMove props={{data, columnEnd, itemWidth, columnPosition, headerHeight, topHandle, renderTopHeader, columnMove, rowHeight, renderItem, amountHeight, amountBackground, renderAmount, columnData}}/>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DraggableTable;


const HorizontalArrow = props => {
    const {width, height} = props;
    const S = 5;

    return <div className="h-arr">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <path d={`M 1,${height/2-0.5}H ${width-1}m -${S},-${S}l ${S},${S}l -${S},${S}`} fill="none" stroke="black" strokeWidth={1}/>
        </svg>
    </div>
};


const VerticalArrow = props => {
    const {width, height} = props;
    const S = 5;

    return <div className="v-arr">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <path d={`M ${width/2-0.5},0
            V ${height-1}
            m -${S},-${S}
            l ${S},${S}
            l ${S},-${S}
            `} fill="none" stroke="black" strokeWidth={1}/>
        </svg>
    </div>
};



