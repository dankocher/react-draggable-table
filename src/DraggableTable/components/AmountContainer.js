import React from 'react';
import './AmountContainer.scss';
import clone from "../utils/clone";
import compareObjects from "../utils/compareObjects";

class AmountContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            amount: clone(props.props.amount)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.props.props.isDragging && !compareObjects(this.props.props.amount, this.state.amount)) {
            this.setState({amount: clone(this.props.props.amount)})
        }
    }

    render() {
        const {amountHeight, amountBackground, leftHeaderWidth, amountText, itemWidth, columnMove, transformX, renderAmount} = this.props.props;

        const {amount} = this.state;
        return (
            <div className="-amount-container" style={{height: amountHeight, backgroundColor: amountBackground, width: leftHeaderWidth + itemWidth * amount.length + 1}}>
                <div className="--amount-text" style={{width: leftHeaderWidth}}>
                    {amountText}
                </div>
                {
                    amount.map((a,i) => <div key={`amount-${i}`} className="--amount-item"
                                             style={{height: amountHeight, width: itemWidth, left: transformX[i]+1}}>
                        {columnMove === i ? '' : renderAmount(a, i)}
                    </div>)
                }
            </div>
        );
    }
}

export default AmountContainer;
