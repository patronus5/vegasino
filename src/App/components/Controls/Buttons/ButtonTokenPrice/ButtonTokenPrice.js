import React from 'react';

//libs
import { LWeb3 } from '../../../../libs/LWeb3';

//components
import { Button, TokenIcon } from '../../'


//css
import './ButtonTokenPrice.css'

class ButtonTokenPrice extends React.Component
{
    constructor(props)
	{   
		super(props)

		//init state
		this.state = 
		{
			token: props.token,
            updateRevision: 0
        }	        
        this.router = window.chef.findRouter(this.state.token?.router)

        this.update = this.update.bind(this)
        this.checkUpdate_token = this.checkUpdate_token.bind(this)
	}

    componentDidMount()
	{	
		this.update()
		document.addEventListener('chef_dataLoaded', this.update)     
        document.addEventListener('token_priceInfo', this.checkUpdate_token)   
	}

	componentWillUnmount()
	{
		document.removeEventListener('chef_dataLoaded', this.update)    
        document.removeEventListener('token_priceInfo', this.checkUpdate_token)  
	}

    checkUpdate_token(_data)
    {
        if (LWeb3.checkEqualAddress(_data.detail.address, this.state.token?.address))
        {
            this.update()      
        }
    }

	update()
	{
        this.setState(
        {
            updateRevision: this.state.updateRevision + 1,
            token: this.props.token
        })
        if (this.router === null)
        {            
            this.router = window.chef.findRouter(this.props.token?.router)
        }		
	}

    getLink()
    {
        let link = ""
        if (this.state.token.linkSwap !== "")
        {
            //token (overriden swap)
            link = this.state.token.linkSwap
                .replace("{from}", "")
                .replace("{to}", this.state.token.address)
        }
        else
        {
            //token
            link = this.router.linkSwap
                .replace("{from}", "")
                .replace("{to}", this.state.token.address)
        }        

        return link
    }
    
	render()
	{
        if (this.router === null)
        {
            return null
        }

        return (
            <Button
                className={"ButtonTokenPrice"}
                href={this.getLink()}
                target="blank">
                <TokenIcon token={this.state.token} />
                {LWeb3.formatFiatDisplay(this.state.token.unitPriceUSD, true)}
            </Button>	
		)
	}
}

export default ButtonTokenPrice;