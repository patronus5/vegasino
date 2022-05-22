import React from 'react';

//components
import { LoadedValue, FormattedToken } from '../..';

class LoadedTokenAmount extends React.Component
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
			<LoadedValue loaded={this.state.token.initialized}>
				<FormattedToken
					token={this.state.token}
					value={this.props.value} />				
			</LoadedValue>
		)
	}
}

export default LoadedTokenAmount;