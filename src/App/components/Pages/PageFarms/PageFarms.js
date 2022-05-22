
import React from 'react';

//components
import { Group, Panel, Text } from '../../Controls'
import { FarmList } from '../../Controls/AddOn'

//css
import './PageFarms.css'

class PageFarms extends React.Component
{
	constructor(props)
	{   
		super(props)
		
		this.refFarmList = React.createRef()
	}

	onChangeFilter(_filter)
	{
		this.refFarmList.current.setFilter(_filter)
	}

    render()
    {
		if (window.chef.farms.length === 0)
		{
			return (
				<Group className="Page_Farms">
					<Panel className="noFarms">
						<Text color="2">
							We found no Farms.
							<br />
							<br />
							Maybe you are connected to the wrong chain?
						</Text>
					</Panel>
				</Group>
			)			
		}

        return (
			<Group className="Page_Farms">
				<FarmList
					ref={this.refFarmList} />
			</Group>
		)
    }
}

export default PageFarms;