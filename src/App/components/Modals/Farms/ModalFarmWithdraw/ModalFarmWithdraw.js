import React from 'react';

//libs
import {LWeb3} from '../../../../libs/LWeb3'

//components
import Modal from '../../Modal'
import { Text, Button, Group, ButtonBuySellToken } from '../../../Controls'
import { InputTokenAmountFarm } from '../../../Controls/AddOn'

//css
import './ModalFarmWithdraw.css'

class ModalFarmWithdraw extends React.Component
{
	constructor(props)
	{   
		super(props)
		
		//init state
		this.state = 
		{
            farm: props.farm || null,
            onClose: props.onClose || null
		}
	}

	close()
	{
		if (!!this.state.onClose)
        {
            this.state.onClose()
        }
	}
	
	async onClick_withdraw()
	{
		this.close()
		await this.state.farm.withdraw(this.getDialogTokensUint256())		
	}

	getDialogTokensUint256()
	{
		const i = document.getElementById("dialog_tokenInput")
		const v = LWeb3.tokensToUint256String(i.value);
		const val = window.chef.web3_data.eth.abi.encodeParameter("uint256", v);
		
		return val;
	}
    
	render()
	{
		let header = <Text size="1">Withdraw {this.state.farm.depositToken?.symbol}</Text>
		let footer = (
            <>
				<ButtonBuySellToken
					token={this.state.farm.depositToken}
					sell={true}
					showLabel={false} />
                <Button
                    className="ModalButton"
                    buttonStyle="1"
                    onClick={() => this.onClick_withdraw()}>
                    withdraw
                </Button>
            </>
        )

		return (
			<Modal
				show={this.props.show}
				className="ModalFarmWithdraw sizeNormal"
				onClose={() => this.close()}
				header={header}
				footer={footer}>
				<Group className="content">
					<Text color="2">
                        Input how many {this.state.farm.depositToken?.symbol} you want to withdraw.
                    </Text>
                    <InputTokenAmountFarm
						balanceLabel="Deposit"
						token={this.state.farm.depositToken}
						max={this.state.farm.userDeposit}
						farm={this.state.farm}
						onChangeFarm={() => this.state.farm.userDeposit} />					
				</Group>
			</Modal>
		)
	}
}

export default ModalFarmWithdraw;