import React from 'react';

//libs
import {LSymbols} from '../../../../../libs/LSymbols'

//components
import { Group, Text, Link, TokenIcon } from '../../..'

//css
import './FarmHeader.css'

class FarmHeader extends React.Component
{
	constructor(props)
	{   
		super(props);

        this.farm = props.farm

        this.showDetailsLink = (typeof props.showDetailsLink === 'boolean' ? props.showDetailsLink : true)
        this.showSettings = (typeof props.showSettings === 'boolean' ? props.showSettings : false)
        this.showContract = (typeof props.showContract === 'boolean' ? props.showContract : true)
	}   

	onClick_settings()
	{
		
	}

    render()
    {
        //details
        let details = <></>
        if (this.showDetailsLink)
        {
            const link = `farm?id=${this.farm.id}`;
            details = (
                <Link nav={true} href={link}>
                    {LSymbols.info('svgLink Farm_Details glow', null, 'View Farm Details')}
                </Link>
            )
        }

        //settings
        let settings = <></>
        if (this.showSettings)
        {
            settings = (
                <>
                    {LSymbols.settings('svgLink Farm_Settings', () => this.onClick_settings(), 'View Farm Settings')}
                </>
            )
        }

        //contract
        let contract = <></>;
        if (this.showContract) 
        {
            contract = (
                <>
                    <Link href={window.chef.currentChain.linkExplorerContract.replace("{address}", this.farm.address)} target="blank">
                        {LSymbols.link("svgLink", null, 'View Contract')}
                    </Link>
                </>
            );
        }

        return (
			<Group className="FarmHeader">
                <TokenIcon token={this.farm.depositToken} />
                <Group className="FarmHeaderGroup">
                    <Text className="name" color="1">
                        {this.farm.name}
                        {details}
                        {settings}
                    </Text>
                    <Text className="platform" color="0">
                        Earn: {this.farm.rewardToken.symbol}
                        {contract}
                    </Text>
                </Group>
            </Group>
		)
    }
}

export default FarmHeader;