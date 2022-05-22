import React from 'react';
import {LWeb3} from '../../../../libs/LWeb3'
import Modal from '../../Modal'
import { Text, Button, Group, Input, InputTokenAmount } from '../../../Controls'
import './ModalVegasinoDeposit.css'

class ModalVegasinoDeposit extends React.Component {
	constructor(props) {   
		super(props)
		
		this.state = {
			id: "inputForTokenDeposit",
            vegasinoPool: props.vegasinoPool || null,
			onClose: props.onClose || null,
			flag: props.flag
		}
	}

	close() {
		if (!!this.state.onClose)
        {
            this.state.onClose()
        }
	}

	async onClick_deposit() {
		this.close()
		await this.state.vegasinoPool.deposit(this.getDialogTokensUint256())		
	}

	getDialogTokensUint256() {
		const i = document.getElementById("inputForTokenDeposit")
		const v = LWeb3.tokensToUint256String(i.value);
		const val = window.chef.web3_data.eth.abi.encodeParameter("uint256", v);
		
		return val;
	}
    
	render() {
		let header = <Text size="1">Deposit {this.state.vegasinoPool.depositToken?.symbol}</Text>
		let footer = (
            <>			
                <Button
                    className="ModalButton"
                    buttonStyle="1"
                    onClick={() => this.onClick_deposit()}>
                    deposit
                </Button>
            </>
        )

		return (
			<Modal
				show={this.props.show}
				className="ModalFarmDeposit sizeNormal"
				onClose={() => this.close()}
				header={header}
				footer={footer}>
				<Group className="content">
					<Text color="2">
						{ this.state.flag === false
							? `Input how many ${this.state.vegasinoPool.depositToken?.symbol} you want to deposit.`
							: `Input which ${this.state.vegasinoPool.depositToken?.symbol} you want to deposit.`
						}
                    </Text>
					<Group className="InputTokenAmountCustom">
						<Group className="inputContainer">
							<Input
								id={this.state.id}
								ref={this.ref_input}
								onChange={this.state.onChange}
								type="number"
								min="0"
								placeholder="0" />
							{/* <Group className="info"> */}
							{ this.state.flag === false &&
								<Button buttonStyle="1" onClick={() => this.onClick_max()}>
									Max
								</Button>
							}
							{/* </Group> */}
						</Group>
					</Group>
				</Group>
			</Modal>
		)
	}
}

export default ModalVegasinoDeposit