import React from 'react';

//css
import './Input.css'

class Input extends React.Component
{
	constructor(props)
	{   
		super(props)
		 
		//init state
		this.state = 
		{
			onChange: props.onChange || null,
			onBlur: props.onBlur || null
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

	onBlur(_e)
	{
		if (this.state.onBlur !== null)
		{
			this.state.onBlur(_e)
		}
	}

	getValue()
	{
		return this.refInput.current.value
	}

	setValue(_value)
	{
		this.refInput.current.value = _value
	}

	focus() 
	{
		this.refInput.current.focus();

		const length = this.refInput.current.value.length;
		this.refInput.current.setSelectionRange(length, length);
	}

    render()
	{
        let cn = "Input " + (this.props.className || "")

		return (			
			<input
				className={cn}
				id={this.props.id}			
				ref={this.refInput}	
				type={this.props.type || "text"}
				name={this.props.name}
				min={this.props.min}
				max={this.props.max}
				inputMode={this.props.inputmode}
				pattern={this.props.pattern}
				title={this.props.title}
				step={this.props.step}
				value={this.props.value}
				style={this.props.style}
				placeholder={this.props.placeholder}
				onChange={(_e) => this.onChange(_e)}
				onBlur={(_e) => this.onBlur(_e)}
				readOnly={this.props.readOnly || false} />
		)
	}
}

export default Input;