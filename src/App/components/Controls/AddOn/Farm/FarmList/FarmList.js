import React from 'react';

//components
import { Group, Text } from '../../..'
import { FarmView, FarmModalManager } from '../../'

//css
import './FarmList.css'

class FarmList extends React.Component
{
	constructor(props)
	{   
		super(props)
		
		//init state
		this.state = 
		{
            updateRevision: 0,
            filter:
            {
				name: "",
				onlyDeposit: false,
				farmType: "",
				asset: ""
			}
		}

        this.updateList = this.updateList.bind(this)
        this.refFarmModalManager = React.createRef()
	}

    componentDidMount()
	{	
		this.updateList()
		document.addEventListener('chef_dataLoaded', this.updateList)
	}

    componentWillUnmount()
	{	
		document.removeEventListener('chef_dataLoaded', this.updateList)
	}

	updateList()
	{
		this.setState({ updateRevision: this.state.updateRevision + 1 })
	}

    setFilter(_filter)
    {
        this.setState({ filter: _filter })
    }

    filterFarms()
    {
        let filteredFarms = []
        if (window.chef.masterChef === undefined)
        {
            return filteredFarms
        }
		
		//filter
		let filter = this.state.filter;
		for (let n = 0; n < window.chef.farms.length; n++)
		{
			let farm = window.chef.farms[n];

            //name
            if (filter.name !== ""
                && !farm.name.includes(filter.name.toUpperCase()))
            {
                continue;
            }
            
            //FarmType
            if ((filter.farmType === "Pool"
                    && farm.isFarm())
                || (filter.farmType === "Farm"
                    && !farm.isFarm())
                || (filter.farmType === "Stable"
                    && !farm.hasStable()))
            {
                continue
            }

            //deposit / balance
            if ((filter.hideZeroBalance
                    && !farm.userHasBalance())
                || (filter.onlyDeposit
                    && !farm.userHasDeposit()))
            {
                continue
            }


            //push
            filteredFarms.push(farm);
		}		
		
		return filteredFarms;
    }

    renderFilterResultEmpty()
    {
        return (
            <Group className="FarmList">
                <Text className="emptyFilter">
                    There are no results that match your current filter!
                </Text>
            </Group>
        )
    }

    render()
    {
        const farms = this.filterFarms()
        if (farms.length === 0)
        {
            return this.renderFilterResultEmpty()
        }

        let farmIndex = 0
        const farmList = farms.map((v) =>
        {
            const even = (farmIndex % 2 === 0)
            farmIndex += 1
            return (
                <React.Fragment key={v.id.toString()}>
                    <FarmView
                        id={v.id}
                        className={(even ? 'even' : 'odd')}
                        refFarmModalManager={this.refFarmModalManager} />
                </React.Fragment>
            )
        })

        return (
            <>
                <FarmModalManager ref={this.refFarmModalManager} />
                <Group className="FarmList">
                    {farmList}
                </Group>
            </>
		)
    }
}

export default FarmList;