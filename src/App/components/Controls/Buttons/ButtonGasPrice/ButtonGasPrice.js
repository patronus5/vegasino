import React from 'react';

//libs
import {LSymbols} from '../../../../libs/LSymbols'

//components
import { Button } from '../../'

//css
import './ButtonGasPrice.css'

class ButtonGasPrice extends React.Component
{
    constructor(props)
	{   
		super(props)

		//init state
		this.state = 
		{
			gasPrice: window.chef.avgGasPrice
		}

		this.refreshGasPrice = this.refreshGasPrice.bind(this)
	}

	componentDidMount()
	{	
		document.addEventListener('app_reload', this.refreshGasPrice)        
	}

	componentWillUnmount()
	{
		document.removeEventListener('app_reload', this.refreshGasPrice)
	}

	refreshGasPrice()
	{
		this.setState({ gasPrice: window.chef.avgGasPrice })
	}

	render()
	{
		let gasPriceLevel = " medium"
		if (!!window.chef
			&& !!window.chef.currentChain)
		{
			if (!!window.chef.currentChain.gasPriceLow
				&& this.state.gasPrice <= window.chef.currentChain.gasPriceLow)
			{
				gasPriceLevel = " low"
			}
			else if (!!window.chef.currentChain.gasPriceHigh
				&& this.state.gasPrice >= window.chef.currentChain.gasPriceHigh)
			{
				gasPriceLevel = " high"			
			}
		}

		return (
			<Button
                buttonStyle="0"
                className={"ButtonGasPrice" + gasPriceLevel}
				href={window.chef.currentChain?.linkGasTracker}
                target="blank">				
				{LSymbols.fuel("svgLink")}
                {parseFloat(this.state.gasPrice)} GWEI                
			</Button>
		)
	}
}

export default ButtonGasPrice;