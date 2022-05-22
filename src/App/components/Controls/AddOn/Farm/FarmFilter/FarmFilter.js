import React from 'react';

//components
import { Group, Input, Text, CheckBox, Select } from '../../..'

//css
import './FarmFilter.css'

class FarmFilter extends React.Component
{
	constructor(props)
	{   
		super(props)
		
		//init state
		this.state = 
		{
            updateRevision: 0,
            onChangeFilter: props.onChangeFilter || null
		}

        this.filter = 
        {
            platformName: "",
            name: "",
            onlyDeposit: false,
            hideZeroBalance: false,
            farmType: "",
            asset: ""
        }

        //refs
        this.refInputName = React.createRef()
        this.refCheckboxZeroBalance = React.createRef()
        this.refCheckboxDeposited = React.createRef()
        this.refSelectType = React.createRef()
	}

	updateList()
	{
		this.setState({ updateRevision: this.state.updateRevision + 1 })
	}

    filterChanged()
    {
        //change filter
        this.filter.name = this.refInputName.current.getValue()
        this.filter.onlyDeposit = this.refCheckboxDeposited.current.isChecked()
        this.filter.hideZeroBalance = this.refCheckboxZeroBalance.current.isChecked()
        this.filter.farmType = this.refSelectType.current.getValue()

        //call event
        if (this.state.onChangeFilter)
        {
            this.state.onChangeFilter(this.filter)
        }
    }

    render()
    {   
        return (
            <Group className="FarmFilter">
                <Group className="name">
                    <Text color="2" size="-1">
                        Name:
                    </Text>
                    <Input
                        ref={this.refInputName}
                        onChange={() => this.filterChanged()}
                        placeholder="filter by name" />
                </Group>

                <Group className="zeroBalance">
                    <Text color="2" size="-1">
                        Hide 0 Balances:
                    </Text>    
                    <CheckBox
                        ref={this.refCheckboxZeroBalance}
                        onChange={() => this.filterChanged()} />                
                </Group> 

                <Group className="deposited">
                    <Text color="2" size="-1">
                        Deposited:
                    </Text>  
                    <CheckBox
                        ref={this.refCheckboxDeposited}
                        onChange={() => this.filterChanged()} />                  
                </Group>

                <Group className="type">
                    <Text color="2" size="-1">
                        Type:
                    </Text>
                    <Select
                        ref={this.refSelectType}
                        options={["", "Pool", "Farm", "Stable"]}
                        onChange={() => this.filterChanged()}
                        placeholder="select type" />
                </Group>                
            </Group>
		)
    }
}

export default FarmFilter;