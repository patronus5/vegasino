import React from 'react';

//libs
import {LWeb3} from '../../../libs/LWeb3'
import {LSymbols} from '../../../libs/LSymbols'

//components
import Modal from '../Modal'
import { Text, Button, Group } from '../../Controls'

//css
import './ModalConnectWallet.css'
import { LLib } from '../../../libs';

//vars
var modal_ConnectWallet = null

class ModalConnectWallet extends React.Component
{
	constructor(props)
	{   
		super(props)
		
		//init state
		this.state = 
		{
            show: props.show || false				
		}

		//vars
		modal_ConnectWallet = this
	}

	static showModal_ConnectWallet()
	{
		modal_ConnectWallet.setShow(true)
	}

	setShow(_show)
	{
		this.setState(
		{
			show: _show
		})
	}

	async onClick_ConnectWallet(_providerID)
	{
		this.setShow(false);
		LLib.setStorage(false, 'web3_disconnected', false);
		LLib.setStorage(false, 'web3_provider', _providerID);
		try
		{
			await LWeb3.selectProvider(_providerID);			
		}
		catch (e) { }
		if (window.chef.walletInstalled)
		{
			await window.chef.connectToWallet((window.chef.account !== null));
			LLib.setStorage(false, 'web3_disconnected', false); 
		}
		window.location.reload();
	}

	async onClick_DisconnectWallet()
	{
		this.setShow(false);
		LLib.setStorage(false, 'web3_disconnected', true);		
		window.location.reload();
	}

	renderProviderButtons()
	{		
        return (			
            <>
                <Button
					buttonStyle="0"
                    className={"ProviderButton provider_MetaMask"}
                    onClick={() => this.onClick_ConnectWallet("MetaMask")}>
					{LSymbols.wallet_metaMask()}
                    Metamask
                </Button>
                <Button
					buttonStyle="0"
                    className={"ProviderButton provider_WalletConnect"}
                    onClick={() => this.onClick_ConnectWallet("WalletConnect")}>
					{LSymbols.wallet_walletConnect()}
                    WalletConnect
                </Button>
				<Button
					buttonStyle="0"
                    className={"ProviderButton provider_BinanceWallet"}
                    onClick={() => this.onClick_ConnectWallet("MetaMask")}>
					{LSymbols.wallet_binance()}
                    Binance Wallet
                </Button>
				<Button
					buttonStyle="0"
                    className={"ProviderButton provider_TrustWallet"}
                    onClick={() => this.onClick_ConnectWallet("MetaMask")}>
					{LSymbols.wallet_trustWallet()}
                    Trust Wallet
                </Button>
            </>
        )
	}

	render()
	{
		let header = <Text size="1">Select Wallet:</Text>
		let footer = (
			<>
				<Button className="ModalButton" onClick={() => this.setShow(false)}>
					cancel
				</Button>
				{window.chef.web3_user !== null && 
					<Button
						className="ModalButton"
						onClick={() => this.onClick_DisconnectWallet()}>
						logout
					</Button>
				}
			</>
		)

		return (
			<Modal
				show={this.state.show}
				className="ModalConnectWallet sizeNormal"
				onClose={() => this.setShow(false)}
				header={header}
				footer={footer}>
				<Group className="ProviderButtons">
					{this.renderProviderButtons()}
				</Group>
			</Modal>
		)
	}
}

export default ModalConnectWallet;