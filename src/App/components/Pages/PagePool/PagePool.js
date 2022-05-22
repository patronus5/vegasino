
import React from 'react';

//components
import { Group, Panel, Text } from '../../Controls'
import { FarmCard, FarmModalManager } from '../../Controls/AddOn'

//css
import './PagePool.css'

class PagePool extends React.Component
{
	constructor(props)
	{   
		super(props)

		this.refFarmModalManager = React.createRef()
	}

    render()
    {
		if (window.chef.farms.length === 0)
		{
			return (
				<Group className="Page_Pool">
					<Panel className="noPool">
						<Text color="2">
							We found no Pool.
							<br />
							<br />
							Maybe you are connected to the wrong chain?
						</Text>
					</Panel>
				</Group>
			)			
		}

        return (
			<Group className="Page_Pool">
				<FarmModalManager ref={this.refFarmModalManager} />
				<FarmCard
					id={0}
					refFarmModalManager={this.refFarmModalManager} />
			</Group>
		)
    }
}

export default PagePool;