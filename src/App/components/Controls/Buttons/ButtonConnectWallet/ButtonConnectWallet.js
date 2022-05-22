import React from 'react';

//libs
import { LWeb3 } from '../../../../libs/LWeb3';

//modals
import ModalConnectWallet from '../../../Modals/ModalConnectWallet/ModalConnectWallet'

//components
import { Button } from '../../';

//css
import './ButtonConnectWallet.css';

class ButtonConnectWallet extends React.Component
{
	constructor(props)
	{   
		super(props)

		//init state
		this.state = 
		{
			account: ''
		}

		this.refreshCurrentAccount = this.refreshCurrentAccount.bind(this)
	}

	componentDidMount()
	{	
		this.refreshCurrentAccount()
		document.addEventListener('chef_dataLoaded', this.refreshCurrentAccount)        
	}

	componentWillUnmount()
	{
		document.addEventListener('chef_dataLoaded', this.refreshCurrentAccount)      
	}

	refreshCurrentAccount()
	{
		const account = (window.chef === undefined || window.chef.account === null ? '' : window.chef.account)
		this.setState({ account })
	}

	onClick_button()
	{
		ModalConnectWallet.showModal_ConnectWallet()
	}

	renderWalletState()
	{
		if (this.state.account === '')
		{
			return 'Connect'
		}

		return LWeb3.formatAddress(this.state.account)
	}
	
	render()
	{
		return (
			<Button
				className="ButtonConnectWallet"
				buttonStyle="1"
				onClick={() => this.onClick_button()}>
				{this.renderWalletState()}
			</Button>
		)
	}
}

export default ButtonConnectWallet;