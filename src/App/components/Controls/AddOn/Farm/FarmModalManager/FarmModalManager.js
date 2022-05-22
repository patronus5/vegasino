import React from 'react';

//modals
import ModalFarmWithdraw from '../../../../Modals/Farms/ModalFarmWithdraw/ModalFarmWithdraw'
import ModalFarmDeposit from '../../../../Modals/Farms/ModalFarmDeposit/ModalFarmDeposit'
import ModalFarmApprove from '../../../../Modals/Farms/ModalFarmApprove/ModalFarmApprove'

class FarmModalManager extends React.Component
{
	constructor(props)
	{   
		super(props)
		
		//init state
		this.state = 
		{
            showDialog_deposit: false,
            showDialog_withdraw: false,
            showDialog_approve: false,
            showDialog_profitCalculator: false,
            dialogFarm: null
		}
	}

    closeFarmDialog()
    {
        this.setState(
        {
            showDialog_deposit: false,
            showDialog_withdraw: false,
            showDialog_approve: false,
            showDialog_profitCalculator: false,
            dialogFarm: null
        })
    }

    showFarmDialog(_type, _farm)
    {
        this.setState(
        {
            showDialog_deposit: (_type === "deposit"),
            showDialog_withdraw: (_type === "withdraw"),
            showDialog_approve: (_type === "approve"),
            dialogFarm: _farm
        })
    }
    
    render()
    {
        if (this.state.showDialog_withdraw)
        {
            return (
                <ModalFarmWithdraw
                    farm={this.state.dialogFarm}
                    show={this.state.showDialog_withdraw}
                    onClose={() => this.closeFarmDialog()} />
            )
        }
        else if (this.state.showDialog_deposit)
        {
            return (
                <ModalFarmDeposit
                    farm={this.state.dialogFarm}
                    show={this.state.showDialog_deposit}
                    onClose={() => this.closeFarmDialog()} />
            )
        }
        else if (this.state.showDialog_approve)
        {
            return (
                <ModalFarmApprove
                    farm={this.state.dialogFarm}
                    show={this.state.showDialog_approve}
                    onClose={() => this.closeFarmDialog()} />
            )
        }
        else if (this.state.showDialog_profitCalculator) 
        {
        }

        return null
    }
}

export default FarmModalManager;