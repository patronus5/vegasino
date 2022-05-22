import React from 'react';

//components
import { Button, Group, Image } from '../../'

//css
import './ButtonAddToken.css'

class ButtonAddToken extends React.Component
{
	constructor(props)
	{   
		super(props)
		
		//find icon
        this.token = props.token
		this.icon1 = ""
        this.icon2 = ""
        this.initIcons()
	}	

    initIcons()
    {
        //find icons            
        if (this.token !== null
            && !!this.token.icon)
        {
            this.icon1 = this.token.icon
        }
        if (this.token?.token0 !== null
            && this.icon1 === "")
        {
            let token1 = window.chef.findToken(this.token.token0)
            this.icon1 = token1.icon
        }
        if (this.token?.token1 !== null)
        {
            let token2 = window.chef.findToken(this.token.token1)
            this.icon2 = token2.icon				
        }
    }  
		
	async onClick_addToken(e)
	{
		await this.token.addToWallet();
	}

    renderIcon()
    {
        if (this.icon2 === "")
        {
            return (
                <Group className="TokenIcon tokenIconSingle">
                    <Image className="icon1" src={this.icon1} />
                </Group>
            )
        }
        else
        {
            return (
                <Group className="TokenIcon tokenIconDual">
                    <Image className="icon1" src={this.icon1} />
                    <Image className="icon2" src={this.icon2} />
                </Group>
            )
        }
    }
	
	render()
	{
        if (this.props.mode === 'text')
        {
            let name = this.props.token.symbol
            if (this.props.token.token0 !== null)
            {
                name = 'LP'
            }

            const label = `show ${name} in wallet`;
            return (
                <button onClick={(e) => this.onClick_addToken(e)}>
                    {label}
                </button>
            )
        }

		return (
			<Button
                buttonStyle="0"
                className="ButtonAddToken"
                onClick={() => this.onClick_addToken()}>
				{this.renderIcon()}
				show in wallet
			</Button>
		)
	}
}

export default ButtonAddToken;