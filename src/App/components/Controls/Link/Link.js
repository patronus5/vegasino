import React from 'react';
import { NavLink } from 'react-router-dom';

//css
import './Link.css';

class Link extends React.Component
{
	constructor(props)
	{   
		super(props)
		
		//init state
		this.state = 
		{
			onClick: props.onClick
		}	
	}

    buildPropsClassName()
	{
		//build props name
		let propsClassName = ""	

		//size
		let fontSize = parseInt(this.props.size || 0)
		switch (fontSize)
		{
			case -1:
				propsClassName += "sizeSmall"
				break;

			case 1:
				propsClassName += "sizeBig"
				break;

			case 2:
				propsClassName += "sizeVeryBig"
				break;

			default:
				propsClassName += "sizeNormal"
		}
		propsClassName += " "

		//weight
		let fontWeight = parseInt(this.props.weight || 0)
		switch (fontWeight)
		{
			case -1:
				propsClassName += "weightLight"
				break;

			case 1:
				propsClassName += "weightBold"
				break;

			default:
				propsClassName += "weightNormal"
		}
		propsClassName += " "        

		//color
		let fontColor = parseInt(this.props.color || 1)
		switch (fontColor)
		{
			case 0:
				propsClassName += "colorDisabled"
				break;

			case 2:
				propsClassName += "colorSecondary"
				break;

			default:
				if (this.props.nav === true)
				{
					propsClassName += "colorMenu"
				}
				else
				{
					propsClassName += "colorPrimary"
				}
		}
		propsClassName += " "

        //disabled
        propsClassName += (this.props.disabled === true ? "disabled " : "")

		return propsClassName
    }
	
	render()
	{
		let cn = "Link " + this.buildPropsClassName() + (this.props.className || "")
		
        if (this.props.href === undefined)
        {
            //BUTTON
            return (
                <button className={cn} onClick={this.state.onClick} title={this.props.title}>
                    {this.props.children}
                </button>
            )
        }
		else if (this.props.nav === true)
		{
			//NavLink
            return (
                <NavLink className={cn} to={this.props.href} title={this.props.title}>
                    {this.props.children}
                </NavLink>
            )
		}
        else
        {
            //A
            return (
                <a className={cn} href={this.props.href} target={this.props.target} title={this.props.title}>
                    {this.props.children}
                </a>
            )
        }
	}
}

export default Link;