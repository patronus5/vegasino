import React from 'react';
import ModalVegasinoApprove from '../../../../../Modals/Pools/ModalVegasinoApprove/ModalVegasinoApprove'
import ModalVegasinoDeposit from '../../../../../Modals/Pools/ModalVegasinoDeposit/ModalVegasinoDeposit'
import ModalVegasinoWithdraw from '../../../../../Modals/Pools/ModalVegasinoWithdraw/ModalVegasinoWithdraw'

class VegasinoModalManager extends React.Component {
	
    constructor(props) {   
		super(props)
		
		this.state = {
            showDialog_deposit: false,
            showDialog_withdraw: false,
            showDialog_approve: false,
            showDialog_profitCalculator: false,
            dialogVegasinoPool: null,
            flag: false
		}
	}

    closeVegasinoDialog() {
        this.setState({
            showDialog_deposit: false,
            showDialog_withdraw: false,
            showDialog_approve: false,
            showDialog_profitCalculator: false,
            dialogVegasinoPool: null,
            flag: this.state.flag
        })
    }

    showVegasinoDialog(_type, _vegasinoPool, flag) {
        this.setState({
            showDialog_deposit: (_type === "deposit"),
            showDialog_withdraw: (_type === "withdraw"),
            showDialog_approve: (_type === "approve"),
            dialogVegasinoPool: _vegasinoPool,
            flag
        })
    }
    
    render() {
        if (this.state.showDialog_withdraw) {
            return (
                <ModalVegasinoWithdraw
                    vegasinoPool={this.state.dialogVegasinoPool}
                    show={this.state.showDialog_withdraw}
                    flag={this.state.flag}
                    onClose={() => this.closeVegasinoDialog()} />
            )
        }
        else if (this.state.showDialog_deposit) {
            return (
                <ModalVegasinoDeposit
                    vegasinoPool={this.state.dialogVegasinoPool}
                    show={this.state.showDialog_deposit}
                    flag={this.state.flag}
                    onClose={() => this.closeVegasinoDialog()} />
            )
        }
        else if (this.state.showDialog_approve) {
            return (
                <ModalVegasinoApprove
                    vegasinoPool={this.state.dialogVegasinoPool}
                    show={this.state.showDialog_approve}
                    flag={this.state.flag}
                    onClose={() => this.closeVegasinoDialog()} />
            )
        }
        else if (this.state.showDialog_profitCalculator) 
        {
        }

        return null
    }
}

export default VegasinoModalManager;