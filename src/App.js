import React from 'react';
import './App.css';
import './items.scss';
import DraggableTable from "./DraggableTable";
import Handle from './components/Handle';


const topHeader = [
    'A', 'B', 'C', 'D', 'E', 'F'
];
const leftHeader = [
    '1', '2', '3', '4', '5'
];

const amount = [
    3, 4, 1, 4, 0, 3
];
// const data = [
//     ['A1', 'B1', 'C1'],
//     ['A2', 'B2', 'C2'],
//     ['A3', 'B3', 'C3'],
//     ['A4', 'B4', 'C4'],
//     ['A5', 'B5', 'C5']
// ];

const data = [
    ['A1', 'B1', 'C1', 'D1', 'E1', 'F1'],
    ['A2', 'B2', 'C2', 'D2', 'E2', 'F2'],
    ['A3', 'B3', 'C3', 'D3', 'E3', 'F3'],
    ['A4', 'B4', 'C4', 'D4', 'E4', 'F4'],
    ['A5', 'B5', 'C5', 'D5', 'E5', 'F5']
];
function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
}

class App extends React.Component {

    state = {
        data,
        leftHeader,
        topHeader,
        amount,
        amountMax: getMaxOfArray(amount)
    };

    renderTopHeader = (children, index) => {
        return <div className={'top-header-item'}>
            <div className="top-side">Column {children}</div>
            <div className="bottom-side">{index+1}</div>
        </div>
    };

    renderLeftHeader = (children, index) => {
        return <div className={'left-header-item'}>
            Row {children}
        </div>
    };

    renderItem = (children, index) => {
        return <div className="item">
            Item {children}<br/>
            Item {children}<br/>
            Item {children}
        </div>
    };

    renderAmount = (children, index) => {
        return <div className="amount">
            {this.state.amount[index] === this.state.amountMax ?
                <b>{children}</b> :
                <a>{children}</a>
            }
        </div>
    };

    reset = () => {
        this.setState({
            data,
            leftHeader,
            topHeader,
            amount
        })
    };

    render() {
        return (
            <div className="App">
                <div>
                    <DraggableTable
                        topHeader={this.state.topHeader}
                        leftHeader={this.state.leftHeader}
                        data={this.state.data}
                        renderTopHeader={this.renderTopHeader}
                        renderLeftHeader={this.renderLeftHeader}
                        renderItem={this.renderItem}
                        renderAmount={this.renderAmount}
                        topHandle={<TopHandle/>}
                        leftHandle={<LeftHandle/>}
                        amount={this.state.amount}
                        amountText={'Итого:'}
                        leftHeaderWidth={110}
                        headerHeight={101}
                        amountHeight={46}
                        itemWidth={140}
                        rowHeight={80}
                        amountBackground={'#E0E0E0'}

                        setRows={(leftHeader, data) => this.setState({leftHeader, data})}
                        setColumns={(topHeader, data, amount) => this.setState({topHeader, data, amount})}

                        horizontalArrow={"Приоритет категорий"}
                        verticalArrow={"В корзине"}
                    />
                </div>
                <div>
                    {/*<button onClick={this.reset}>Cancel</button>*/}
                </div>
            </div>
        )
    }
}

export default App;



const LeftHandle = () => {
    return <div className="left-handle">
        <Handle/>
    </div>
};

const TopHandle = () => {
    return <div className="top-handle">
        <Handle/>
    </div>
};
