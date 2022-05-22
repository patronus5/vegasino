import React from 'react';

//components
import { Button, Group, Image } from '../../'

//css
import './ButtonSwapLiquidity.css'

class ButtonSwapLiquidity extends React.Component
{
	constructor(props)
	{   
		super(props)
		
		//find icon
        this.token = props.token
		this.icon = ""
        this.initIcon()
	}	

    initIcon()
    {
        //find icons            
        if (this.token !== null
            && !!this.token.icon)
        {
            this.icon = this.token.icon
        }
    }  
		
	async onClick_SwapLiquidity()
	{
        await window.chef.moonChef.swapForLiquidity(this.token)
	}

    renderIcon()
    {
        return (
            <Group className="TokenIcon tokenIconSingle">
                <Image className="icon" src={this.icon} />
            </Group>
        )
    }
	
	render()
	{
		return (
			<Button
                buttonStyle="0"
                className="ButtonSwapLiquidity"
                onClick={() => this.onClick_SwapLiquidity()}>
				{this.renderIcon()}
				swap for liquidity
			</Button>
		)
	}
}

export default ButtonSwapLiquidity;