import React from 'react';

//css
import './CheckBox.css'

class CheckBox extends React.Component
{	
    constructor(props)
	{   
		super(props)
		 
		//init state
		this.state = 
		{
			onChange: props.onChange || null,
		}

		this.refInput = React.createRef()
	}

	onChange(_e)
	{
		if (this.state.onChange !== null)
		{
			this.state.onChange(_e)
		}
	}

    isChecked()
	{
		return this.refInput.current.checked
	}

	render()
	{
		//build class name
		let cn = "CheckBox " + (this.props.className || "")		
		
		//render
		return (
			<input
                id={this.props.id}			
                ref={this.refInput}	
                name={this.props.name}
                className={cn}
                type="checkbox"
				checked={this.props.checked}
				onChange={(e) => this.onChange(e)} />
		)
	}
}

export default CheckBox;