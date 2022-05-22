//libs
import {LLib} from '../libs/LLib'
import {LWeb3} from '../libs/LWeb3'

//classes
import Cache from './Cache'

//contracts
import {ABI_MasterChef} from './../contracts/MasterChef';

class Farm
{
	////////////////////////////////////

	constructor(_data)
	{
		//init
		this.initialized = false
		this.initializedInfo = false
		this.initializedUser = false
		
		//base values
		this.id = _data.id
		this.name = _data.name
		this.icon = _data.icon || ""
		this.depositTokenAddress = _data.depositToken
		this.rewardTokenAddress = _data.rewardToken
		this.additionalDepositTax = (_data.additionalDepositTax || 0) / 100
		this.additionalWithdrawTax = (_data.additionalWithdrawTax || 0) / 100
		
		//values
		this.router = ""
		
		//fees
		this.depositFee = 0
		this.withdrawFee = 0
		this.totalDepositFeeTaxFactor = 1
        this.totalWithdrawFeeTaxFactor = 1
		this.calculateFees()
				
		//get total values
		this.totalDeposit = "0"
		
		//get user value		
		this.userDeposit = "0"
		this.userPending = "0"

		//apr
		this.apr = 0
		this.dailyAPR = 0
		this.compoundedDailyAPR = 0
		this.compounds24h = 1
		this.compoundedAPY = 0

		//meta data
		this.allocPoints = 1
		this.startBlock = 0
		this.endBlock = 0
		this.endTime = null
		this.harvestLockUntil = null
		this.isApproved = false

		//usd
		this.totalDepositUSD = "0"
		this.totalPendingUSD = "0"
		this.userDepositUSD = "0"
		this.userPendingUSD = "0"
		this.compoundRewardUSD = "0"

		//stats	
		this.roiDailyAPR = 0
		this.roiWeeklyAPR = 0
		this.roiMonthlyAPR = 0
		this.roiYearlyAPR = 0
		this.roiDailyAPY = 0
		this.roiWeeklyAPY = 0
		this.roiMonthlyAPY = 0
		this.roiYearlyAPY = 0

		//extended data		
		this.depositToken = window.chef.findToken(this.depositTokenAddress)
		this.rewardToken = window.chef.findToken(this.rewardTokenAddress)
		window.chef.addDepositToken(this.depositToken)

		//events
		this.calculateAPR = this.calculateAPR.bind(this)
		document.addEventListener('token_priceInfo', this.calculateAPR)
	}

	////////////////////////////////////
	
	debugErrorString(_text)
	{
		return 'Farm [' + this.id + '] failed at: ' + _text		
	}

	getContract(_user)
    {       
		return window.chef.masterChef.getContract(_user)
    }

	////////////////////////////////////

	async init()
	{
		if (this.initialized)
		{
			return
		}

		//make multicall
        let mc = LWeb3.makeMultiCall("data")
        let con = this.getContract()
        let calls =
        [ 
            {
                poolInfo: con.methods.poolInfo(this.id),
            }
        ]

		//handle result
        const [ret] = await LWeb3.tryMultiCall(mc, calls, this.debugErrorString("init"))
        const res = ret[0]
		this.allocPoints			= res.poolInfo[1]

		//process
		this.calculateFees()

		//complete
		this.initialized = true
	}

	async reloadFarmInfo()
	{
		//lazy init
		this.init()
		if (!this.initialized)
		{
			return
		}

		//make multicall
        let mc = LWeb3.makeMultiCall("data")
        let con = this.getContract()
        let calls =
        [ 
            {
                poolInfo: con.methods.poolInfo(this.id),		
            }
        ]

		//handle result
        const [ret] = await LWeb3.tryMultiCall(mc, calls, this.debugErrorString("farmInfo"))
        const res = ret[0]
        this.totalDeposit 			= res.poolInfo[4]

		//process
		this.totalDepositUSD = this.depositToken.getPriceUSDForAmount(this.totalDeposit)
		this.calculateAPR()

		//complete
		this.initializedInfo = true

		//event
        document.dispatchEvent(new CustomEvent('farm_farmInfo',
        {
            detail:
            {
                address: this.address
            }
        }))
	}

	async reloadUserInfo()
	{
		//lazy init
		this.init()
		if (!this.initialized)
		{
			return
		}

		//make multicall
        let mc = LWeb3.makeMultiCall("user")
        let con = this.getContract(true)
        let calls =
        [ 
            {
                userInfo: con.methods.userInfo(this.id, window.chef.account),
                userPending: con.methods.pendingRewards(this.id, window.chef.account)
            }
        ]

		//handle result
        const [ret] = await LWeb3.tryMultiCall(mc, calls, this.debugErrorString("userInfo"))
        const res = ret[0]
        this.userDeposit 	= res.userInfo[0]
		this.userPending 	= res.userPending

		//additional request
		if (!this.isApproved)
		{
			this.isApproved = await this.checkApproved()
		}

		//process
		this.userDepositUSD = this.depositToken.getPriceUSDForAmount(this.userDeposit)
		this.userPendingUSD = this.rewardToken.getPriceUSDForAmount(this.userPending)
		this.calculateEarnings()

		//complete
		this.initializedUser = true

		//event
        document.dispatchEvent(new CustomEvent('farm_userInfo',
        {
            detail:
            {
                address: this.address
            }
        }))
	}

	////////////////////////////////////	

	async checkApproved()
	{
		return await this.depositToken.checkApproved(window.chef.masterChef.address)
	}

	async approve()
	{
		await this.depositToken.approve(window.chef.masterChef.address)
	}

	async deposit(_amount)
	{
		const amountStr = LWeb3.smartFormatTokens(window.chef.toBN(_amount), this.depositToken, true)
		await window.chef.masterChef.deposit(this.id, _amount, `Deposit ${amountStr} ${this.depositToken.getFullName()}`)
	}

	async withdraw(_amount)
	{
		const amountStr = LWeb3.smartFormatTokens(window.chef.toBN(_amount), this.depositToken, true)
		await window.chef.masterChef.withdraw(this.id, _amount, `Withdraw ${amountStr} ${this.depositToken.getFullName()}`)
	}

	async claim()
	{
		await window.chef.masterChef.withdraw(this.id, "0", `Claim ${this.rewardToken.getFullName()}`)
	}

	////////////////////////////////////

	isFarm()
	{
		return this.depositToken.isLPToken()
	}

	hasStable()
	{
		return (this.depositToken.isStable()
			|| this.depositToken.hasStable())
	}

	userHasBalance()
	{
		return (this.depositToken.userBalance !== "0")
	}

	userHasDeposit()
	{
		return (this.userDeposit !== "0")
	}

	////////////////////////////////////
	
	calculateFees()
	{
		this.totalDepositFeeTaxFactor = (1 - this.additionalDepositTax) * (1 - this.depositFee)
        this.totalWithdrawFeeTaxFactor = 1 / (1 - this.additionalWithdrawTax) / (1 - this.withdrawFee) / (1 - window.chef.masterChef.withdrawFee)
	}

	calculateAPR()
	{
		//get reward amount per year
		const ap = window.chef.toBN(this.allocPoints)
		const tap = window.chef.toBN(window.chef.masterChef.totalAllocPoints)
		const bpy = window.chef.toBN(window.chef.currentChain.blocksPerDay).mul(window.chef.toBN(365))
		const epy = window.chef.toBN(window.chef.masterChef.emissionPerBlock).mul(bpy)
		const pepy = epy.mul(ap).div(tap)

		//get reward amount * price
		const rewardValue = this.rewardToken.getPriceUSDForAmount(pepy)

		//get apr
		const rewardFloat = parseFloat(LWeb3.fullFormatTokens(rewardValue, window.chef.stableToken))
		const depositFloat = parseFloat(LWeb3.fullFormatTokens(this.totalDepositUSD, window.chef.stableToken))
		const apr = (depositFloat === 0 ? 0 : rewardFloat / depositFloat)
		this.dailyAPR = apr / 365
		this.compoundedDailyAPR = this.dailyAPR
		this.apr = this.compoundedDailyAPR * 365
		this.compoundedAPY = (Math.pow((this.dailyAPR / this.compounds24h) + 1, 365 * this.compounds24h) - 1)	

		this.calculateEarnings()		
	}

	calculateEarnings()
	{
		const depositUSD = LWeb3.smartFormatFiat(this.userDepositUSD, window.chef.stableToken)
		const dailyUSD = depositUSD * this.dailyAPR

		//apr	
		this.roiDailyAPR = dailyUSD
		this.roiWeeklyAPR = dailyUSD * 7
		this.roiMonthlyAPR = dailyUSD * 30
		this.roiYearlyAPR = dailyUSD * 365

		//apy
		this.roiDailyAPY = dailyUSD
		this.roiWeeklyAPY = depositUSD * (Math.pow(1 + this.dailyAPR, 7) - 1)
		this.roiMonthlyAPY = depositUSD * (Math.pow(1 + this.dailyAPR, 30) - 1)
		this.roiYearlyAPY = depositUSD * (Math.pow(1 + this.dailyAPR, 365) - 1)
	}

	////////////////////////////////////
}

export default Farm;