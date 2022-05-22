import React from 'react';

//css
import './Button.css';

class Button extends React.Component
{
	constructor(props)
	{   
		super(props)
		
		//init state
		this.state = 
		{
			onClick: props.onClick,
			style: props.style
		}	
	}

	buildPropsClassName()
	{
		//build props name
		let propsClassName = ""	

		//style
		let buttonStyle = parseInt(this.props.buttonStyle || 0)
		switch (buttonStyle)
		{
			case 1:
				propsClassName += "stylePrimary"
				break;

			default:
				propsClassName += "styleNormal"
		}
		propsClassName += " "

		//disabled
		if (this.props.disabled === true)
		{
			propsClassName += "disabled "
		}

		return propsClassName
	}
	
	render()
	{
		let cn = "Button " + this.buildPropsClassName() + (this.props.className || "")

		if (this.props.href === undefined)
        {
            //BUTTON
            return (
                <button className={cn} onClick={this.state.onClick} title={this.props.title}>
                    {this.props.children}
                </button>
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

export default Button;