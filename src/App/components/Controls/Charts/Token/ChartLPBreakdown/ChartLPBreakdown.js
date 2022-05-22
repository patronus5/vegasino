//libs
import {LLib} from '../../../../../libs/LLib';

//components
import { Chart } from '../../..';
import { LWeb3 } from '../../../../../libs/LWeb3';

class ChartLPBreakdown extends Chart
{
	constructor(props)
	{   
		super(props)
		
		//init state
		this.state =
		{
			...this.state,
			token: props.token,
			days: props.days || 30,
			relative: props.relative === true,
			onlyCurrent: true
		}		
		this.token0 = window.chef.findToken(this.state.token.token0)
		this.token1 = window.chef.findToken(this.state.token.token1)
		this.token0Max = null
		this.token1Max = null

		this.reloadData = this.reloadData.bind(this)
		this.formatLPTokenDataPoint = this.formatLPTokenDataPoint.bind(this)
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
		let data = []
		try
		{
			let apiURL = window.chef.api_url + "?module=token&action=getTokenPriceHistory"
			apiURL += "&chain=" + window.chef.currentChain.id
			apiURL += "&token=" + this.state.token.address
			apiURL += "&days=" + this.state.days
			data = await LLib.fetchJSON(apiURL)
		}
		catch (e) { }
		
		//fill data
		this.processData(data)
	}

	formatLPTokenDataPoint(_val, _dataPoint)
	{
		if (!_dataPoint)
		{
			return ""
		}

		if (this.state.relative
			&& !this.state.onlyCurrent)
		{
			return _val * (_dataPoint.seriesIndex === 0 ? this.token0Max : this.token1Max)
		}
		else
		{
			return _val
		}
	}
	
	initChart(_liquidityInfos)
	{		
		//init
		let colors = 
		[
			'#1969ff',
			'#fea430'
		]
		let rangeStart = new Date()
		rangeStart.setDate(rangeStart.getDate() - this.state.days);
		
		//set options
		let opts = this.makeOptions()	
		this.setType(opts, (this.state.onlyCurrent ? "pie" : "line"))
		this.setColors(opts, colors)
		opts.chart = 
		{
			...opts.chart,
			sparkline:
			{
				enabled: !this.onlyCurrent
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
				show: true
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
			show: false,
			labels:
			{
				formatter: this.formatLPTokenDataPoint
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
					return LLib.formatDate(value, true, true);
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
			show: false,
			position: 'top'
		}
		if (this.state.onlyCurrent)
		{
			opts.chartOptions =
			{
				...opts.chartOptions,
				labels:
				[
					this.token0.symbol,
					this.token1.symbol
				]
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

		this.token0Max = null
		this.token1Max = null
		
		let series = []
		let categories = []															 
		let data = []
		let data2 = []

		if (this.state.onlyCurrent)
		{
			//make series
			const totalSupply = window.chef.toBN("0x" + this.state.token.totalSupply)
            const token0Res = window.chef.toBN("0x" + this.state.token.token0Reserve)
			const token0ResOne = token0Res.mul(this.token0.one).div(totalSupply)
			const token0ResF = parseFloat(LWeb3.smartFormatTokens(token0ResOne, this.token0))
            const token1Res = window.chef.toBN("0x" + this.state.token.token1Reserve)   
			const token1ResOne = token1Res.mul(this.token1.one).div(totalSupply)         
            const token1ResF = parseFloat(LWeb3.smartFormatTokens(token1ResOne, this.token1))
			data.push(token0ResF, token1ResF)
		}
		else
		{
			for (let n = 0; n < _priceInfos.data.length; n++)
			{
				const priceInfos = _priceInfos.data[n]
				const dt = LLib.getDateTimeFromDB(priceInfos.date)
				const dtVal = dt.getTime()

				//make series
				const totalSupply = window.chef.toBN("0x" + priceInfos.totalSupply)
				const token0Res = window.chef.toBN("0x" + priceInfos.token0Reserve)
				const token0ResOne = token0Res.mul(this.token0.one).div(totalSupply)
				const token0ResF = parseFloat(LWeb3.smartFormatTokens(token0ResOne, this.token0))
				const token1Res = window.chef.toBN("0x" + priceInfos.token1Reserve)   
				const token1ResOne = token1Res.mul(this.token1.one).div(totalSupply)         
				const token1ResF = parseFloat(LWeb3.smartFormatTokens(token1ResOne, this.token1))
				
				//max
				if (this.token0Max === null
					|| this.token0Max < token0ResF)
				{
					this.token0Max = token0ResF					
				}
				if (this.token1Max === null
					|| this.token1Max < token1ResF)
				{
					this.token1Max = token1ResF					
				}

				//values
				data.push([dtVal, token0ResF])
				data2.push([dtVal, token1ResF])
			}
		}

        //scale series
		if (this.state.relative
			&& !this.state.onlyCurrent)
		{
			for (let n = 0; n < data.length; n++)
			{
				if (this.token0Max !== 0)
				{
					data[n][1] = data[n][1] / this.token0Max
				}
				if (this.token1Max !== 0)
				{
					data2[n][1] = data2[n][1] / this.token1Max
				}
			}
		}

		//add series
        series.push(
        {
            name: this.token0.symbol,
            data: data					
        })
		if (this.state.onlyCurrent)
		{
			series = data
		}
		else
		{
			series.push(
			{
				name: this.token0.symbol,
				data: data					
			})
			series.push(
			{
				name: this.token1.symbol,
				data: data2					
			})

			categories = data.map(item => item[0])		
		}
		let opts = this.initChart(_priceInfos)
		this.setSeries(opts, series, categories)
	}
}

export default ChartLPBreakdown;