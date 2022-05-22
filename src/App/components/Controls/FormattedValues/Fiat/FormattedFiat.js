import React from 'react';

//libs
import { LLib, LWeb3 } from '../../../../libs'

class FormattedFiat extends React.Component
{
	render()
	{
		return LWeb3.formatFiatDisplay(
            this.props.value,
            LLib.defaultUndefined(this.props.allowLongerer, true));
	}
}

export default FormattedFiat;