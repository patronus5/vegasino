import React from 'react';

//libs
import {LLib} from '../../../libs/LLib'
import {LWeb3} from '../../../libs/LWeb3'
import {LSymbols} from '../../../libs/LSymbols'

//config
import {config} from '../../../config'

//components
import { Text, Group, Panel, Link, Image, Button } from '../../Controls'

//css
import './PageHome.css'

class PageHome extends React.Component
{
	constructor(props)
	{   
		super(props)
		 
		//init state
		this.state = 
		{
			updateRevision: 0
		}

		this.updatePage = this.updatePage.bind(this)
	}

	componentDidMount()
	{	
		document.addEventListener('chef_dataLoaded', this.updatePage)
		document.addEventListener('app_reload', this.updatePage)       
	}

	componentWillUnmount()
	{	
		document.removeEventListener('chef_dataLoaded', this.updatePage)
		document.removeEventListener('app_reload', this.updatePage)       
	}

	updatePage()
	{
		// this.setState({ updateRevision: this.state.updateRevision + 1 })
	}

	renderContactMedia()
	{
		return (			
			<Group className="links">
				<Group className="LinkGroup">
					<Link color="2" href="https://t.me/VegasinoBSC" target="blank">
						{LSymbols.telegram("svgLink")}
						Telegram
					</Link>
					<Link color="2" href="https://twitter.com/Vegasino_BSC" target="blank">
						{LSymbols.twitter("svgLink")}
						Twitter
					</Link>
				</Group>
			</Group>
		)
	}

	renderStat(_title, _value)
	{
		return (
			<tr>
				<td className="name">
					<Text size="-1" color="2">
						{_title}
					</Text>
				</td>
				<td className="value">
					<Text size="-1" color="2">
						{_value}
					</Text>
				</td>
			</tr>
		)
	}

	renderStats()
	{
		const mc = window.chef.masterChef
		if (mc === null)
		{
			return
		}

		return(
			<Group className="Migrate">
				<Link nav={true} href="/vegas">
					<Button buttonStyle="1">
						Migrate NEVADA
					</Button>
				</Link>
			</Group>
		);

		const nativePool = window.chef.findFarm(0)
		return (
			<Group className="stats">
				<Text color="1" size="0">
					Protocol Stats
				</Text>
				<Group className="StatsTables">
					<table className="StatsTable">
						<tbody>
							{this.renderStat('Total Value Locked:', LLib.renderLoading(window.chef.refreshCount > 0, LWeb3.formatFiatDisplay(window.chef.totalDepositUSD)))}
							{this.renderStat('APR:', LLib.renderLoading(window.chef.refreshCount > 0, LLib.smartFormatPercent(nativePool?.apr * 100, true)))}
						</tbody>
					</table>
					<table className="StatsTable">
						<tbody>
							{this.renderStat(`${window.chef.findToken(config.page.nativeToken).symbol} Price:`, LLib.renderLoading(window.chef.refreshCount > 0, LWeb3.formatFiatDisplay(window.chef.findToken(config.page.nativeToken).unitPriceUSD, true)))}
							{this.renderStat('APY:', LLib.renderLoading(window.chef.refreshCount > 0, LLib.smartFormatPercent(nativePool?.compoundedAPY * 100, true)))}
						</tbody>
					</table>
				</Group>
			</Group>
		)
	}

    render()
    {
        return (
			<Group className="PageHome">
				<Panel className="Panel_Info">
					<Group className="header">
						<Text size="2">
							{config.page.name}
						</Text>
					</Group>
					{this.renderContactMedia()}											
					<Image className="logo" src="/home.png" />
					{this.renderStats()}					
				</Panel>
			</Group>
		)
    }
}

export default PageHome;