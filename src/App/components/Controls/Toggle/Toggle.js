import React from 'react';

//components
import { Group } from '..';

//css
import './Toggle.css';

class Toggle extends React.Component
{
	constructor(props)
	{   
		super(props)
		
		//init state
		this.state =
		{
			checked: props.checked,
			onChange: props.onChange || null
		}
    }	
	
	onCheckChanged()
    {
		const newState = !this.state.checked
		this.setState({ checked: newState })
		if (this.state.onChange !== null)
		{
			this.state.onChange(newState)
		}		
	}

	render() 
	{
		let id = this.props.id || "myOnOffSwitch"
		let labelOn = this.props.labelOn ?? "On"
		let labelOff = this.props.labelOff ?? "Off"
		const labels =
        {
			"--onoffswitch-on-var": `"${labelOn}"`,
			"--onoffswitch-off-var": `"${labelOff}"`
		}

		return (
			<Group className="onoffswitch">
				<input type="checkbox"
					   name="onoffswitch"
					   className="onoffswitch-checkbox"
					   id={id}
					   tabIndex="0"
					   defaultChecked={this.state.checked}
					   onClick={() => this.onCheckChanged()} />
				<label className="onoffswitch-label" htmlFor={id}>
					<span className="onoffswitch-inner" style={labels} />
					<span className="onoffswitch-switch" />
				</label>
			</Group>
		)
	}
}

export default Toggle;