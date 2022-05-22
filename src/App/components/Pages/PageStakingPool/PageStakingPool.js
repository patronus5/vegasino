import React from 'react';
import { Group, Panel, Text } from '../../Controls'
import { StakingPool, VegasinoModalManager } from '../../Controls/AddOn'
import './PageStakingPool.css'

class PageStakingPool extends React.Component {
	constructor(props) {   
		super(props)
		this.refVegasModalManager = React.createRef()
	}

    render() {
		// if (window.chef.farms.length === 0)
		// {
		// 	return (
		// 		<Group className="Page_Pool">
		// 			<Panel className="noPool">
		// 				<Text color="2">
		// 					We found no Pool.
		// 					<br />
		// 					<br />
		// 					Maybe you are connected to the wrong chain?
		// 				</Text>
		// 			</Panel>
		// 		</Group>
		// 	)			
		// }

        return (
			<Group className="Page_Pool">
				<VegasinoModalManager ref={this.refVegasModalManager} />
				<StakingPool refVegasModalManager={this.refVegasModalManager} />
			</Group>
		)
    }
}

export default PageStakingPool;