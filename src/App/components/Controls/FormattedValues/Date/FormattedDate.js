import React from 'react';

//libs
import {LLib} from '../../../../libs'

class FormattedDate extends React.Component
{
	render()
	{
		return LLib.formatDate(
            this.props.value,
            this.props.includeTime,
            this.props.includeSeconds);
	}
}

export default FormattedDate;