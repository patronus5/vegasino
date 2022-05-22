import React from 'react';

//css
import './Text.css'

class Text extends React.Component
{	
	buildPropsClassName()
	{
		//build props name
		let propsClassName = ""	

		//size
		let fontSize = parseInt(this.props.size || 0)
		switch (fontSize)
		{
			case -3:
				propsClassName += "sizeSuperSmall"
				break;

			case -2:
				propsClassName += "sizeVerySmall"
				break;

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

		//italic
		if (this.props.italic === "true")
		{
			propsClassName += "font-italic "
		}		

		//color
		if (!isNaN(this.props.color)
			|| this.props.color === undefined)
		{
			const fontColor = parseInt(this.props.color || 1)
			switch (fontColor)
			{
				case 0:
					propsClassName += "colorDisabled"
					break;

				case 2:
					propsClassName += "colorSecondary"
					break;
				default:
					propsClassName += "colorPrimary"
			}
		}
		propsClassName += " "

		return propsClassName
	}

	render()
	{
		//build class name
		let cn = "Text " + this.buildPropsClassName() + (this.props.className || "")		

		//style
		let style = {}
		if (isNaN(this.props.color))
		{
			style = 
			{
				color: this.props.color
			}
		}
		
		//render
		return (
			<span className={cn} style={style}>
				{this.props.children}
			</span>
		)
	}
}

export default Text;