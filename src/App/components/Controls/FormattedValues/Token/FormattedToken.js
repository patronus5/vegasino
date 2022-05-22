import React from 'react';

//libs
import {LWeb3} from '../../../../libs';

//components
import {FormattedFloat} from '../';

class FormattedToken extends React.Component
{
	render()
	{
		return (
            <FormattedFloat
                value={LWeb3.smartFormatTokens(this.props.value, this.props.token, this.props.shorten)}
                shorten={this.props.shorten}
                minDecimals={this.props.minDecimals}
                maxDecimals={this.props.maxDecimals} />
        );
	}
}

export default FormattedToken;