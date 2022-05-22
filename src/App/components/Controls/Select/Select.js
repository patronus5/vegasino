import React from 'react';

//css
import './Select.css'

class Select extends React.Component
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

	getValue()
	{
		return this.refInput.current.value
	}
	
	render()
	{
		//build class name
		let cn = "Select " + (this.props.className || "")		

        //build options
        let opts = <></>
        if (this.props.options)
        {
            opts = this.props.options.map((o) =>
            {
				let kvp = o
				if (typeof(o) === "string"
					|| typeof(o) === "number")
				{
					kvp = 
					{
						value: o,
						text: o
					}
				}

                return (
                    <option key={kvp.value} value={kvp.value}>
                        {kvp.text}
                    </option>
                )
            })
        }
		
		//render
		return (
			<select
				ref={this.refInput}
				id={this.props.id}
				className={cn}
				value={this.props.value}
				placeholder={this.props.placeholder}
				onChange={(e) => this.onChange(e)}>
				{opts}
			</select>
		)
	}
}

export default Select;