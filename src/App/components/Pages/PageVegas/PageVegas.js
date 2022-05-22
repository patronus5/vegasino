import React from 'react';

//libs
import {LLib, LWeb3} from '../../../libs'

//components
import { Button, Text, Group, Panel, InputTokenAmount, Image } from '../../Controls'

//config
import {config} from '../../../config'

//css
import './PageVegas.css'
import ModalMessage from '../../Modals/ModalMessage/ModalMessage';

class PageVegas extends React.Component
{
	constructor(props)
	{   
		super(props)
		 
		//init state
		this.state = 
		{
			updateRevision: 0
		}

		this.updatePage = this.updatePage.bind(this);
		this.refInputBNB = React.createRef();
	}

	componentDidMount()
	{	
		this.updatePage()
		LLib.subscribeEvents(
			[
				'chef_dataLoaded',
				'app_reload',
				'migrator_init',
				'migrator_user'
			],
			this.updatePage);
	}

	componentWillUnmount()
	{	
		LLib.unsubscribeEvents(
			[
				'chef_dataLoaded',
				'app_reload',
				'migrator_init',
				'migrator_user'
			],
			this.updatePage);  
	}

	updatePage()
	{
		this.setState({ updateRevision: this.state.updateRevision + 1 })
	}

	async onClick_migrate()
	{
		const mig = window.chef.migrator;

		if (!mig.approved)
		{
			await mig.approve();
			return;
		}

		await mig.migrate();
	}

	async onClick_buy()
    {
		ModalMessage.showModal("Can't Buy", "You currently can't buy VEGAS. Wait until the NFTs are released and grab a NFT to buy VEGAS.");
		return;

        const amount = this.refInputBNB.current.getAsUint256();
        await window.chef.cashier.buy(amount)
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

    render()
    {
		const mig = window.chef.migrator;
		if (mig === null)
		{
			return null;
		}

        return (
			<Group className="PageVegas">
				<Panel className="Panel_Info">
					<Image src="/assets/vegas.jpg" />
					<Group className="header">						
						<Text size="0" color="2">
							The Nevada Aliens have to leave their Planet and Migrate to Planets with higher Yields.
							After exploring the bountyful Lands of Vegas, they decided to become Vegasians!
							Migrate your Nevada Alians to Vegasians or get your hands on some Vegasians!
						</Text>
					</Group>
				</Panel>	

				<Panel className="Panel_Info">
					<Group className="header">						
						<Text size="1">
							Migrate
						</Text>
					</Group>

					<Group className="migrateOrBuy">
						<Group className="migrate">
							<Text color="2">
								You can migrate {LWeb3.smartFormatTokens(mig.allowance, window.chef.findToken(config.page.nativeToken), true)} NEVADA
							</Text>
							<br />
							<Button
								buttonStyle="1"
								onClick={() => this.onClick_migrate()}>
								{mig.approved ? "Migrate" : "Enable"}
							</Button>	
						</Group>	
					</Group>		
				</Panel>			
				
				<Panel className="Panel_Info">
					<Group className="header">						
						<Text size="1">
							Buy
						</Text>
					</Group>

					<Group className="migrateOrBuy">
						<Group className="buy">
							<Text color="2">
								You can buy VEGAS when you own a NFT
							</Text>
							<br />

							<InputTokenAmount
								ref={this.refInputBNB} />
							<Button
								className="buy"
								buttonStyle="0"
								onClick={() => this.onClick_buy()}>
								Buy VEGAS
							</Button>
						</Group>
					</Group>
                </Panel>
			</Group>
		)
    }
}

export default PageVegas;