import React from 'react';

//classes
import {LLib} from '../../../libs/LLib'

//components
import { Group, Panel, Text, InputTokenAmount, Button } from '../../Controls'

//css
import './PageBuy.css'

class PageBuy extends React.Component
{
	constructor(props)
	{   
		super(props)

        //init state
		this.state = 
		{
            updateRevision: 0
		}

        this.checkUpdate_cashier = this.checkUpdate_cashier.bind(this);
		this.updateView = this.updateView.bind(this);
        this.refInputBNB = React.createRef();
	}

	componentDidMount()
	{	
		document.addEventListener('chef_dataLoaded', this.updateView)
		document.addEventListener('token_userInfo', this.checkUpdate_cashier)    
	}

	componentWillUnmount()
	{	
		document.removeEventListener('chef_dataLoaded', this.updateView)
		document.removeEventListener('token_userInfo', this.checkUpdate_cashier)   
	}

    checkUpdate_cashier()
    {
        this.updateView()
    }

    updateView()
	{
		this.setState({ updateRevision: this.state.updateRevision + 1 })
	}

    async onClick_buy()
    {
        const amount = this.refInputBNB.current.getAsUint256();
        await window.chef.cashier.buy(amount)
    }

    render()
    {
        const cashier = window.chef.cashier
        if (!cashier)
        {
            return null
        }

        const now = (new Date()).getTime() / 1000
        let happyHour = <></>
        if (cashier.startTimeUTC !== null
            && cashier.endTimeUTC !== null)
        {
            if (now >= cashier.startTimeUTC.getTime() / 1000
                && now <= cashier.endTimeUTC.getTime() / 1000)
            {
                const diff = (cashier.endTimeUTC.getTime() / 1000) - now;
                happyHour = (
                    <Group className="happyHour">
                        <Text className="neonText" size="1" color="2">
                            HAPPY HOUR!
                        </Text>
                        <Text size="-1" color="2">
                            Tax free buy of NEVADA
                        </Text>
                        <Text size="-1" color="2">
                            {LLib.getHMS(diff, true)} remaining
                        </Text>
                    </Group>
                )
            }
            else if (now < cashier.startTimeUTC.getTime() / 1000)
            {
                const diff = (cashier.endTimeUTC.getTime() / 1000) - now;
                happyHour = (
                    <Group className="happyHourSoon" color="2">      
                        <Text size="1" color="2">
                            Buy NEVADA
                        </Text>              
                        <Text size="-1">
                            Next Happy Hour in {LLib.getHMS(diff, true)}
                        </Text>
                    </Group>
                )
            }
            else
            {
                happyHour = (
                    <Group className="happyHourSoon" color="2">      
                        <Text size="1" color="2">
                            Buy NEVADA
                        </Text>
                    </Group>
                )
            }
        }

        return (
			<Group className="Page_Buy">
				<Panel>
                    {happyHour}

                    <InputTokenAmount
                        ref={this.refInputBNB} />
                    <Button
                        className="buy"
                        buttonStyle="1"
                        onClick={() => this.onClick_buy()}>
                        Buy NEVADA
                    </Button>
                </Panel>
			</Group>
		)
    }
}

export default PageBuy;