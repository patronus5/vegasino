import React from 'react'

class Image extends React.Component
{
	render()
	{
		let cn = "Image " + (this.props.className || "")
		
		return (
            <>
			    <img className={cn} src={this.props.src} alt=""/>
            </>
		)
	}
}

export default Image;