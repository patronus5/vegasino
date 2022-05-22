import React from 'react';

//components
import { Group, Text } from '../'

//css
import './ProgressBar.css';

class ProgressBar extends React.Component
{
	constructor(props)
	{   
		super(props)
		
		//init state
		this.state = 
		{
            min: props.min,
            max: props.max,
            yellowStart: props.yellowStart || props.min,
            greenStart: props.greenStart || props.min,
            showLabels: props.showLabels || false,
            infoText: props.infoText
		}	
	}

    makeGradient()
    {
        const range = (this.state.max - this.state.min)
        const p1 = ((this.state.yellowStart / range) * 100).toFixed(0)
        const p2 = ((this.state.greenStart / range) * 100).toFixed(0)

        let gradient = `linear-gradient(
            90deg,
            var(--progressBar_red) 0%,
            var(--progressBar_red) ${p1}%,
            var(--progressBar_yellow) ${p1}%,
            var(--progressBar_yellow) ${p2}%,
            var(--progressBar_green) ${p2}%,
            var(--progressBar_green) 100%)`

        return gradient
    }

    renderProgresInfo(_label, _value, _color)
    {
        const value = (
            <Text size="-1" color={`var(--progressBar_${_color})`}>
                {_value}
            </Text>
        )

        return this.renderLegendContainer(
            _label,
            value,
            _color)
    }

    renderLegendContainer(_label, _text1, _color)
    {
        return (
            <Group className="legendContainer" style={{ borderColor: `var(--progressBar_${_color})`}}>
                <Text size="-1" color={`var(--progressBar_${_color})`}>
                    {_label}
                </Text>
                {_text1}
            </Group>
        )
    }
	
	render()
	{
		let cn = "ProgressBar " + (this.props.className || "")

        //get stats
        const current = this.props.value || 0

        //get style
        let style = 
        {
            background: this.makeGradient(),
            height: "5px"
        }

        let labelLegend = <></>
        if (this.state.showLabels)
        {
            let labelGreen = <></>
            if (this.props.labelGreen !== undefined)
            {
                //not full break even yet
                labelGreen = this.renderProgresInfo(
                    this.props.labelGreen,
                    this.props.textGreen,
                    "green")
            }
            
            //legend
            let labelYellow = <></>
            if (this.props.labelYellow !== undefined)
            {
                //not full break even yet
                labelYellow = this.renderProgresInfo(
                    this.props.labelYellow,
                    this.props.textYellow,
                    "yellow")
            }
            let labelRed = <></>
            if (this.props.labelRed !== undefined)
            {
                //not full break even yet
                labelRed = this.renderProgresInfo(
                    this.props.labelRed,
                    this.props.textRed,
                    "red")
            }

            labelLegend = (
                <>
                    {labelRed}
                    {labelYellow}
                    {labelGreen}
                </>
            )
        }

        //info
        let info = <></>
        if (this.state.infoText !== undefined)
        {
            info = (
                <Group className="infoText">
                    <Text size="-2" color="2" italic="true">
                        {this.state.infoText}
                    </Text>
                </Group>
            )
        }

		return (
            <Group className={cn}>
                <Group className="legend">
                    {labelLegend}
                </Group>
                <input                
                    type="range"
                    style={style}
                    readOnly={true}
                    step={0.01}
                    min={parseFloat(this.state.min)}
                    max={parseFloat(this.state.max)}
                    value={current} />     
                {info}    
            </Group>
        )
	}
}

export default ProgressBar;