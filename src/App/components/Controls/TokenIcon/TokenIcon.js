import React from 'react';

//css
import './TokenIcon.css';

//components
import { Group } from '../../Controls'

class TokenIcon extends React.Component
{
	constructor(props)
	{   
		super(props);

        const token = props.token;
        let icon1 = "";
		let icon2 = ""	;	
		
        if (token && token.icon)
		{
			icon1 = props.token.icon
		}

		if (props.token?.token0 && icon1 === "")
		{
			let token1 = window.chef.findToken(props.token.token0)
			icon1 = token1.icon
		}

		if (props.token?.token1)
		{
			let token2 = window.chef.findToken(props.token.token1)
			icon2 = token2.icon				
		}
      
		//init state
		this.state = 
		{
			icon1,
			icon2,
			height: props.height,
			width: props.width
		};
	}	
		
	render()
	{
		let icon1;
		if (this.state.icon1 !== "")
		{
			icon1 = (
				<img className={"icon1" + (this.state.icon2 !== "" ? " iconLP" : "")} src={this.state.icon1} alt="" />
			)			
		}
		let icon2;
		if (this.state.icon2 !== "")
		{
			icon2 = (
				<img className="icon2 iconLP" src={this.state.icon2} alt="" />
			)			
		}

		let css = {};
		if (this.state.height)
			css.height = this.state.height + "px";
		if (this.state.width)
			css.width = this.state.width + "px";

		return (
			<Group className="TokenIcon icons" style={css}>
				{icon1}
				{icon2}
			</Group>
		)
	}
}

export default TokenIcon;