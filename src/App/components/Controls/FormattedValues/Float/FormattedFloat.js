import React from 'react';

//libs
import {LLib} from '../../../../libs'

class FormattedFloat extends React.Component
{
	render()
	{
		return LLib.smartFormatFloatDisplay(
            this.props.value,
            this.props.shorten || false,
            this.props.minDecimals,
            this.props.maxDecimals);
	}
}

export default FormattedFloat;