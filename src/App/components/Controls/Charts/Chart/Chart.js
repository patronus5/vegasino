import React from 'react';
import ReactApexChart from 'react-apexcharts';

//components
import { Group } from '../../'

//css
import './Chart.css';

var cloneDeep = require('lodash/cloneDeep');

class Chart extends React.Component
{	
	constructor(props)
	{   
		super(props)

		//init state
		this.state = 
		{			
			useColor: props.useColor,
			width: props.width,
			height: props.height,
			series: [],
			options:
			{
				chart:
				{
					type: "line",
					background: "transparent",
					zoom:
					{
						enabled: false,
					},
					toolbar:
					{
						show: false
					}
				},
				colors:
				[
					'#ff0000',
					'#00ff00',
					'#0000ff'
				],						
				dataLabels:
				{
					enabled: false
				},								
				grid:
				{				
					show: false,
					xaxis:
					{
						lines:
						{
							show: false
						}
					},
					yaxis:
					{
						lines:
						{
							show: false
						}
					}					
				},				
				legend:
				{
					show: true,
					showForSingleSeries: false,
					position: "top",
					horizontalAlign: "center", 
					fontSize: "14px",
					fontWeight: 600,
				},
				stroke:
				{
					width: 3,
					curve: "smooth"
				},								
				title:
				{
					text: "",
					align: "left"
				},				
				theme:
				{
					mode: "dark", 
				},			
				tooltip:
				{
					enabled: true,
					theme: "dark",
					marker:
					{
						show: true,
					}
				},
				xaxis:
				{
					type: "category",
					categories: [],
					lines:
					{
						show: false,
					},
					labels:
					{
						show: false,
						cssClass: 'chartLabels'
					}
				},
				yaxis:
				{				
					lines:
					{
						show: false,
					},
					labels:
					{
						show: false,
						cssClass: 'chartLabels'
					}
				},
				layout:
				{
					padding:
					{
						top: 5,
						bottom: 5
					}
				},
				markers: 
				{
					size: 0
				}
			}
		}
		this.chart = null;
		this.showLabels = (this.props.showLabels || false)

		this.baseColors =
		[
			'#fea430',
			'#6236ff',
			'#1969ff',
			'#00aee9',
			'#00c301'
		]
	}

	makeColorList()
	{
		if (this.state.useColor === undefined)
		{
			return this.baseColors
		}

		let arr = [ this.state.useColor ]
		if (Array.isArray(this.state.useColor))
		{
			arr = this.state.useColor
		}

		let colors = []
		for (let n = 0; n < arr.length; n++)
		{
			let colInt = parseInt(arr[n])
			if (colInt >= 0
				&& colInt < this.baseColors.length)
			{
				colors.push(this.baseColors[colInt])
			}
		}
		return colors
	}
	
	makeOptions()
	{
		return cloneDeep(this.state.options)
	}

	setLabels()
	{
		this.showLabels = (this.props.showLabels || false)
	}
	
	setType(_opts, _type)
	{		
		_opts.chart.type = _type
	}

	setMarkers(_opts, _show)
	{
		_opts.markers.size = (_show ? 1 : 0)
	}
	
	setTitle(_opts, _title)
	{
		_opts.title.text = _title
	}
	
	setColors(_opts, _colors)
	{
		_opts.colors = _colors
	}
	
	setCategories(_opts, _cats)
	{
		_opts.xaxis.type= "category"
		_opts.xaxis.categories = _cats		
	}
	
	async setSeries(_opts, _series, _categories)
	{		
		//default
		_opts = _opts ?? this.makeOptions();
		_categories = _categories ?? [];
		
		//set options
		this.setCategories(_opts, _categories)	
		await this.setState(
		{
			series: _series,
			options: _opts
		})
	}	
	
	render()
	{
		return (
			<Group className="Chart">
				<ReactApexChart
					options={this.state.options}
					series={this.state.series}
					width={this.state.width}
					height={this.state.height}
					type={this.state.options.chart.type ?? 'bar'} />
			</Group>
		)
	}
}

export default Chart;