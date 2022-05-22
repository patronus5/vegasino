import React from 'react';

//libs
import {LSymbols} from '../../../../libs/LSymbols'

//components
import { Button, Group, Text } from '../../'

//css
import './ButtonBuySellToken.css'

class ButtonBuySellToken extends React.Component
{
    constructor(props)
	{   
		super(props)

		//init state
		this.state = 
		{
			token: props.token,
            sell: props.sell || false,
            showLabel: props.showLabel || false
        }	

        this.router = window.chef.findRouter(this.state.token?.router)
	}

    getLink()
    {
        let link = ""
        if (this.state.token.isLPToken())
        {
            //LP token
            if (this.state.sell)
            {
                link = this.router.linkRemoveLiquidity
                    .replace("{token0}", this.state.token.token0)
                    .replace("{token1}", this.state.token.token1)
            }
            else
            {
                link = this.router.linkAddLiquidity
                    .replace("{token0}", this.state.token.token0)
                    .replace("{token1}", this.state.token.token1)
            }
        }
        else if (this.state.token.linkSwap !== "")
        {
            //token (overriden swap)
            if (this.state.sell)
            {
                link = this.state.token.linkSwap
                    .replace("{from}", this.state.token.address)
                    .replace("{to}", "")
            }
            else
            {
                link = this.state.token.linkSwap
                    .replace("{from}", "")
                    .replace("{to}", this.state.token.address)
            }
        }
        else
        {
            //token
            if (this.state.sell)
            {
                link = this.router.linkSwap
                    .replace("{from}", this.state.token.address)
                    .replace("{to}", "")
            }
            else
            {
                link = this.router.linkSwap
                    .replace("{from}", "")
                    .replace("{to}", this.state.token.address)
            }
        }        

        return link
    }

    getLabel()
    {
        let lbl = ""
        if (this.state.token.isLPToken())
        {
            //LP token
            if (this.state.sell)
            {
                lbl = "to remove liquidity"
            }
            else
            {
                lbl = "to add liquidity"
            }
        }
        else
        {
            //token
            if (this.state.sell)
            {
                lbl = "to sell token"
            }
            else
            {
                lbl = "to buy token"
            }
        }

        if (lbl !== "")
        {
            return <Text color="2">{lbl}</Text>
        }
        return
    }
    
	render()
	{
        if (this.router === null)
        {
            return null
        }

        return (
            <Group className="ButtonBuySellToken">
                {this.state.showLabel ? <Text color="2">Click</Text> : <></>}
                <Button
                    className={"ButtonBuySellToken " + (this.state.sell ? "sell" : "buy")}
                    href={this.getLink()}
                    target="blank">
                    {LSymbols.cart()}
                </Button>
                {this.state.showLabel ? this.getLabel() : <></>}		
            </Group>
		)
	}
}

export default ButtonBuySellToken;