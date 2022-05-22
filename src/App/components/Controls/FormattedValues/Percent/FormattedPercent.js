import React from 'react';

//libs
import {LLib} from '../../../../libs'

class FormattedPercent extends React.Component
{
	render()
	{
		return LLib.smartFormatPercent(
            this.props.value,
            this.props.shorten,
            LLib.defaultUndefined(this.props.minDecimals, 0),
            LLib.defaultUndefined(this.props.maxDecimals, 2));
	}
}

export default FormattedPercent;