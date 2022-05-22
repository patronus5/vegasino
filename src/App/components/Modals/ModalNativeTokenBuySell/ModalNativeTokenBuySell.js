import React from 'react';

//components
import Modal from '../Modal'
import { Text, Button, Link } from '../../Controls'

//css
import './ModalNativeTokenBuySell.css'

//vars
var modal_nativeTokenBuySell = null

class ModalNativeTokenBuySell extends React.Component
{
    constructor(props)
	{   
		super(props)
		
		//init state
		this.state = 
		{
            show: props.show || false,
            buy: false,
            amount: "0"
		}

		//vars
		modal_nativeTokenBuySell = this
	}

	static showModal(_buy, _amount)
	{
		modal_nativeTokenBuySell.setShow(true)
        modal_nativeTokenBuySell.setState(
        {
            buy: _buy,
            amount: _amount,
        })
	}

	setShow(_show)
	{
		this.setState(
		{
			show: _show
		})
	}

    async onClick_buy()
    {
        await window.chef.moonChef.buy(this.state.amount)	
    }

    async onClick_sell()
    {
        await window.chef.moonChef.sell(this.state.amount)	
    }

	async onClick_close()
	{
        this.setShow(false)
	}

	render()
	{
		let header = <></>
		let footer = <></>
        let text = <></>

        if (this.state.buy)
        {
            //buy
            text = <>Before you buy {window.chef.moonChef.moonToken.symbol}:</>
            header = <Text size="1">Buy {window.chef.moonChef.moonToken.symbol}</Text>
            footer = (
                <>
                    <Button className="ModalButton" onClick={() => this.onClick_close()}>
                        cancel
                    </Button>
                    <Button buttonStyle="1" className="ModalButton" onClick={() => this.onClick_buy()}>
                        I understand the risks
                    </Button>
                </>
            )
        }
        else
        {
            //sell
            text = <>Before you sell {window.chef.moonChef.moonToken.symbol}:</>
            header = <Text size="1">Sell {window.chef.moonChef.moonToken.symbol}</Text>
            footer = (
                <>
                    <Button className="ModalButton" onClick={() => this.onClick_close()}>
                        cancel
                    </Button>
                    <Button buttonStyle="1" className="ModalButton" onClick={() => this.onClick_sell()}>
                        I understand the risks
                    </Button>
                </>
            )
        }

		return (
			<Modal
				show={this.state.show}
				className="ModalNativeTokenBuySell sizeNormal"
				onClose={() => this.setShow(false)}
				header={header}
				footer={footer}>
				<Text color="2">
                	{text}
                    <br />
                    <br />
                    Please take some time to understand the risks. Due to our unique tokenomics,
                    &nbsp;you always buy {window.chef.moonChef.moonToken.symbol}&nbsp;
                    above its current value. The protocol profits slowly increase {window.chef.moonChef.moonToken.symbol}
                    &nbsp;value until you break even. Click&nbsp;
					<Link href="https://docs.moon-vault.com/features/token" target="blank">
						here
					</Link>
					&nbsp;to read the docs of our token.         
				</Text>
			</Modal>
		)
	}
}

export default ModalNativeTokenBuySell;