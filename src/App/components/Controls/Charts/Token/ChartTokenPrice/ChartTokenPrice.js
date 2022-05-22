//libs
import {LLib} from '../../../../../libs/'

//components
import { Chart } from '../../..'

class ChartTokenPrice extends Chart
{
	constructor(props)
	{   
		super(props)
		
		//init state
		this.state =
		{
			...this.state,
			token: props.token,
			days: props.days || 30
		}

		this.reloadData = this.reloadData.bind(this)
	}
	
	componentDidMount()
	{
		this.reloadData()
		this.interval = setInterval(this.reloadData, 60000)
		this.setState({ options: this.initChart() })
        document.addEventListener('chef_dataLoaded', this.reloadData)
	}

	componentWillUnmount()
	{
		clearInterval(this.interval)
		document.removeEventListener('chef_dataLoaded', this.reloadData)
	}

	async reloadData()	
	{
		//data		
		const data = this.state.token.db_getHistoricPrice(
		{
			days: this.state.days
		})
		
		//fill data
		this.processData(data)
	}

	initChart(_liquidityInfos)
	{		
		//init
		let colors = this.makeColorList()
		let rangeStart = new Date()
		rangeStart.setDate(rangeStart.getDate() - this.state.days);
		
		//set options
		let opts = this.makeOptions()	
		this.setLabels()
		this.setType(opts, "area")
		this.setColors(opts, colors)
		opts.chart = 
		{
			...opts.chart,
			sparkline:
			{
				enabled: !this.showLabels
			},
			zoom:
			{
				type: 'x'
			}
		}
		opts.xaxis =
		{
			...opts.xaxis,
			type: "datetime",
			//min: rangeStart.getTime(),
			labels:
			{
				...opts.xaxis.labels,
				show: false
			},
			axisTicks:
			{
				show: false
			},
			tooltip:
			{
				enabled: false
			}
		}
		opts.yaxis =
		{
			...opts.yaxis,
			show: this.showLabels,
			tickAmount: 4,
			labels:
			{
				formatter: function(_val, _dataPoint)
				{
					return LLib.formatFiat(_val);
				}
			}
		}
		opts.tooltip = 
		{
			...opts.tooltip,
			x:
			{
				...opts.tooltip.x,
				show: true,
				formatter: function(value)
                {
					return LLib.formatDate(value, false, true);
				}
			}
		}
		opts.stroke =
		{
			...opts.stroke,
			curve: "straight",
		}
		opts.legend =
		{
			...opts.legend,
			show: true,
			position: 'top'
		}
		opts.fill = 
		{
			...opts.fill,
			type: 'gradient',
			gradient:
			{				
				type: 'vertical',
				opacityFrom: 0.8,
				opacityTo: 0.3,
				stops: [0, 100]
			}
		}
		return opts	
	}
	
	async processData(_priceInfos)
	{
		if (_priceInfos === undefined
            || window.chef.web3_data === null)
		{
			return
		}	

		let series = []
		let categories = []															 
		let data = []
		for (let n = 0; n < _priceInfos.data.length; n++)
		{
			const priceInfos = _priceInfos.data[n]
			const dt = LLib.getDateTimeFromDB(priceInfos.date)
			const dtVal = dt.getTime()

            //make series
			data.push([dtVal, priceInfos.price.toFixed(4)])			
		}

		//add series
		series.push(
		{
			name: "Price",
			data: data					
		})
		
		categories = data.map(item => item[0])		
		let opts = this.initChart(_priceInfos)
		this.setSeries(opts, series, categories)
	}
}

export default ChartTokenPrice;