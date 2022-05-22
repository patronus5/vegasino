import React from 'react';

//components
import { LoadedValue, FormattedFiat } from '../..';

class LoadedTokenPrice extends React.Component
{
    constructor(props)
	{   
		super(props);
		
		//init state
		this.state = 
		{
			token: props.token
		};	
	}

	render()
	{
        return (
			<LoadedValue loaded={this.state.token.initialized && this.state.token.initializedPrice}>
				<FormattedFiat value={this.state.token.getPriceUSDForAmount(this.props.value)} />
			</LoadedValue>
		);
	}
}

export default LoadedTokenPrice;