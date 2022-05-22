import React from 'react'

//components
import Group from '../Group/Group'

//css
import './Panel.css'

class Panel extends React.Component
{	
	render()
	{
		let cn = "Panel " + (this.props.className || "")
		
		return (
            <Group className={cn}>
			    {this.props.children}
            </Group>
		)
	}
}

export default Panel;