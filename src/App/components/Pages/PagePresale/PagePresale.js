import React from 'react';

//libs
import {LLib, LWeb3, LSymbols} from '../../../libs'

//components
import { Button, Text, Group, Panel, Input } from '../../Controls'

//modals
import ModalMessage from '../../Modals/ModalMessage/ModalMessage'

//css
import './PagePresale.css'

class PagePresale extends React.Component
{
	constructor(props)
	{   
		super(props)
		 
		//init state
		this.state = 
		{
			updateRevision: 0,
			presaleID: props.presaleID || ""
		}

		this.updatePage = this.updatePage.bind(this);
		this.refInputAmount = React.createRef();
		this.presale = null;
	}

	componentDidMount()
	{	
		this.updatePage()
		document.addEventListener('chef_dataLoaded', this.updatePage);
		document.addEventListener('app_reload', this.updatePage);      
		document.addEventListener('presale_info', this.updatePage);      
		document.addEventListener('presale_userInfo', this.updatePage); 
	}

	componentWillUnmount()
	{	
		document.removeEventListener('chef_dataLoaded', this.updatePage);
		document.removeEventListener('app_reload', this.updatePage);    
		document.removeEventListener('presale_info', this.updatePage);      
		document.removeEventListener('presale_userInfo', this.updatePage);    
	}

	updatePage()
	{
		this.setState({ updateRevision: this.state.updateRevision + 1 })
	}

	async onClick_buy()
	{
		const amount = this.refInputAmount.current.getValue();
		const presale = this.presale;

		if (!presale.approved)
		{
			presale.approve();
			return;
		}
		
		if (presale.getPhase() === 1
		 	&& !presale.whitelisted)
		{
			ModalMessage.showModal("Cannot buy", "You cannot buy during whitelist sale, as you are not whitelisted! Wait for Free-for-all sale to buy.");
			return;
		}
		else if (amount > presale.userAvailable)
		{
			if (presale.getPhase() === 1)
			{
				ModalMessage.showModal("Cannot buy", "You cannot buy more than you are allowed to buy during whitelist sale! Wait for Free-for-all sale to buy more.");
			}
			else
			{
				ModalMessage.showModal("Cannot buy", "You cannot buy more than the remaining supply!");
			}
			return;
		}
		else if (amount === "")
		{
			ModalMessage.showModal("Cannot buy", "Please enter an amount.");
			return;
		}
		
		await window.chef.presale.buy(amount);
	}

	renderStat(_text, _value, _className)
	{
		return (
			<Group className={"stat " + (_className || "")}>
				<Text className="name" color="2">
					{_text}
				</Text>
				<Text className="value" color="1">
					{_value}
				</Text>
			</Group>);
	}

	renderWhiteListSlotStat()
	{
		const presale = this.presale;
		return (
			<>
				{this.renderStat(
					"Whitelist Slot:",
					LLib.renderLoading(
						presale.initializedUser,
						(presale.whitelisted ?
							LSymbols.success("hasWhitelist") :
							LSymbols.error("hasNoWhitelist"))),
					"WhitelistSlot")}
			</>
		);
	}

	renderWhitelistPhase()
	{
		const presale = this.presale;
		return (
			<Group className="info">
				{this.renderStat("Free-for-all sale start:", LLib.formatDate(presale.whitelistEndTimeUTC, true))}
				{this.renderStat("Available:", `${presale.availableSupply} / ${presale.forSale}`)}
				{this.renderStat("You can buy:", LLib.renderLoading(presale.initializedUser, presale.userAvailable))}
				{this.renderStat("Price per NFT: ", `${LWeb3.smartFormatTokensDisplay(presale.pricePerUnit, window.chef.wrappedCoin, true)} ${window.chef.currentChain?.coin}`)}
				{this.renderWhiteListSlotStat()}					
			</Group>
		)
	}

	renderFreeForAllPhase()
	{
		const presale = this.presale;
		return (
			<Group className="info">
				{this.renderStat("Available:", `${presale.availableSupply} / ${presale.forSale}`)}
				{this.renderStat("You can buy:", LLib.renderLoading(presale.initializedUser, presale.userAvailable))}
				{this.renderStat("Price per NFT: ", `${LWeb3.smartFormatTokensDisplay(presale.pricePerUnit, window.chef.wrappedCoin, true)} ${window.chef.currentChain?.coin}`)}
			</Group>
		)
	}

	renderPhase()
	{
		const presale = this.presale;
		if (presale.getPhase() === 2)
		{
			return this.renderFreeForAllPhase();
		}
		else if (presale.getPhase() === 1)
		{
			return this.renderWhitelistPhase();
		}
		else
		{
			return (
				<Group className="info">
					{this.renderStat("Whitelist Presale Start:", LLib.formatDate(presale.saleStartTimeUTC, true))}
					{this.renderStat("Available:", `${presale.availableSupply} / ${presale.forSale}`)}
					{this.renderStat("You can buy:", LLib.renderLoading(presale.initializedUser, presale.userAvailable))}
					{this.renderStat("Price per NFT: ", `${LWeb3.smartFormatTokensDisplay(presale.pricePerUnit, window.chef.wrappedCoin, true)} ${window.chef.currentChain?.coin}`)}
					{this.renderWhiteListSlotStat()}
				</Group>
			)
		}
	}

    render()
    {
		this.presale = window.chef.findPresale(this.state.presaleID);
		if (this.presale === null)
		{
			return null;
		}
		const now = (new Date()).getTime();

        return (
			<Group className="PagePresale">
				<Panel className="Panel_Info">
					<Group className="header">
						<Text size="2">
							NFT Sale
						</Text>
						<br />
						<Text size="0" color="2">
							Nevada Alien is a race of highly intelligence NFT with a total population of 2,500 bred on Binance Smart Chain.
							With their prodigiousness, gambling on a casino is an extremely easy task for them to do.
							These Aliens will basically go on a rampant from casino to casino making their ridiculously massive profit.
							Mint them, stake them, and they'll continually give you juicy APY in forms of $NEVADA!
						</Text>
					</Group>

					<Group className="buyInfo">
						{this.renderPhase()}
						<Group className="buy" style={{visibility: (now > this.presale.saleStartTimeUTC.getTime() ? "visible" : "hidden")}}>
							<Input
								placeholder="amount"
								ref={this.refInputAmount}
								min={0}
								step={1}
								pattern="[0-9]" />

							<Button
								buttonStyle="1"
								onClick={() => this.onClick_buy()}>
								{this.presale.approved ? "Buy" : "Enable"}
							</Button>	
						</Group>	
					</Group>		
				</Panel>
			</Group>
		)
    }
}

export default PagePresale;