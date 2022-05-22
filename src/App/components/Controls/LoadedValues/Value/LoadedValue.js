import React from 'react';

//css
import './LoadedValue.css';

class LoadedValue extends React.Component
{
	render()
	{
        if (this.props.loaded)
        {
            return this.props.children;
        }

		return (
            <span className="LoadedValue">
                ???
            </span>
        )
	}
}

export default LoadedValue;