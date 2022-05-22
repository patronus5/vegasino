//libs
import {LWeb3} from '../libs/LWeb3';
import {LLib} from '../libs/LLib';

//classes
import Cache from './Cache'

//contracts
import {ABI_IToken} from '../contracts/IToken';

class Token
{
    ////////////////////////////////////

	constructor(_data)
	{	
        this.initialized = false
        this.initializedPrice = false
        this.initPair = (_data.initPair || false)

		//base values
		this.address = _data.contract || ""
        this.symbol = _data.symbol || ""
        this.icon = _data.icon
        this.linkSwap = _data.linkSwap || ""
        this.router = (_data.router || "")
        this.decimals = (_data.decimals === undefined ? 18 : _data.decimals)
        this.one = window.chef.toBN(10).pow(window.chef.toBN(this.decimals))
        this.token0 = (_data.token0 || null)
		this.token1 = (_data.token1 || null)
        this.oracleType = (_data.oracleType || "")
        this.oracleParameter = (_data.oracleParameter || "")

        //info
        this.unitPriceUSD = "0"
        this.liquidityValue = "0"
        this.liquidityAmount = "0"
        this.token0Reserve = "0"
        this.token1Reserve = "0"
        this.totalSupply = "0"
        this.lastPriceUpdate = null

        //cache
        this.cache_tokenPriceHistory = new Cache(async (_p) => await this.db_getHistoricPrice(_p, true), 60 * 5) //5min
        this.cache_tokenLPFeeHistory = new Cache(async (_p) => await this.db_getHistoricLPFee(_p, true), 60 * 5) //5min

        //user info
        this.userBalance = "0"
        this.userBalanceUSD = "0"
	}

    ////////////////////////////////////
	
	debugErrorString(_text)
	{
		return 'Token [' + this.symbol + '] failed at: ' + _text		
	}

    getContract(_user)
    {        
        const web3 = window.chef.selectWeb3Connection(_user)
        const con = new web3.eth.Contract(ABI_IToken, this.address)
        return con
    }

    ////////////////////////////////////

    static async batchInit(_tokens)
    {
        let batchObjects = []
        let batchCalls = []

        //get valid tokens
        _tokens.forEach((t) => 
        {
            if (!t.initialized
                && t.address !== "")
            {     
                batchObjects.push(t)
                batchCalls.push(t.makeRequest_init())              
            }
        })
        if (batchObjects.length !== 0)
        { 
            //make multicall
            const mc = window.chef.makeMultiCall(false)
            const [ret] = await LWeb3.tryMultiCall(mc, batchCalls, "[Token] batch init", "Token: init")

            //process calls
            for (let n = 0; n < batchObjects.length; n++)
            {
                const t = batchObjects[n]
                const r = ret[n]
                await t.processRequest_init(r)
            }
        }

        return _tokens.filter(t => t.initialized)
    }

    makeRequest_init()
    {
        const con = this.getContract()
        let call = {
            name: con.methods.name(),
            decimals: con.methods.decimals() 
        }
        if (this.symbol === "")
        {
            call.symbol = con.methods.symbol()
        }
        if (this.initPair)
        {
            call.token0 = con.methods.token0()
            call.token1 = con.methods.token1()
        }
        if (this.initPair
            || this.isLPToken())
        {            
            call.reserves = con.methods.getReserves()
            call.totalSupply = con.methods.totalSupply()
        }

        return call
    }

    async processRequest_init(_data)
    {        
        this.name = _data.name
        this.decimals = _data.decimals
        if (this.symbol === "")
        {
            this.symbol = _data.symbol
        }
        if (this.initPair)
        {
            this.token0 = _data.token0
            this.token1 = _data.token1
        }
        if (this.initPair
            || this.isLPToken())
        {   
            this.totalSupply = _data.totalSupply
            this.token0Reserve = _data.reserves[0]
            this.token1Reserve = _data.reserves[1]
        }

        //process
        this.one = window.chef.toBN(10).pow(window.chef.toBN(this.decimals))

        //complete
        this.initialized = true
    }    

	async init()
	{	
        if (this.initialized
            || this.address === "")
        {
            return
        }

		//handle result
        const [ret] = await LWeb3.tryMultiCall(
            window.chef.makeMultiCall(false),
            [
                await this.makeRequest_init()
            ],
            this.debugErrorString("init"),
            "Token: init")
        await this.processRequest_init(ret[0])        
	}

    ////////////////////////////////////

    static async batchLoadPairInfo(_tokens)
    {
        let batchObjects = []
        let batchCalls = []

        //get valid tokens
        const initToken = await Token.batchInit(_tokens)
        initToken.forEach((t) => 
        {
            if (t.isLPToken())
            {
                batchObjects.push(t)
                batchCalls.push(t.makeRequest_pairInfo())
            }
        })
        if (batchObjects.length === 0)
        {
            return
        }

        //make multicall
        const mc = window.chef.makeMultiCall(false)
        const [ret] = await LWeb3.tryMultiCall(mc, batchCalls, "[Token] batch pairInfo", "Token: pairInfo")

        //process calls
        for (let n = 0; n < batchObjects.length; n++)
        {
            const t = batchObjects[n]
            const r = ret[n]
            await t.processRequest_pairInfo(r)
        }
    }

    makeRequest_pairInfo()
    {
        const con = this.getContract()
        return {
            reserves: con.methods.getReserves(),
            totalSupply: con.methods.totalSupply()
        }
    }

    async processRequest_pairInfo(_data)
    {
        this.totalSupply = _data.totalSupply
        this.token0Reserve = _data.reserves[0]
        this.token1Reserve = _data.reserves[1]

        //event
        document.dispatchEvent(new CustomEvent('token_pairInfo',
        {
            detail:
            {
                address: this.address
            }
        }))
    }    

    async reloadPairInfo()
    {
        await this.init()
        if (!this.initialized
            || !this.isLPToken())
        {
            return
        }

		//handle result
        const [ret] = await LWeb3.tryMultiCall(
            window.chef.makeMultiCall(false),
            [
                this.makeRequest_pairInfo()
            ],
            this.debugErrorString("pairInfo"),
            "Token: pairInfo")
        await this.processRequest_pairInfo(ret[0])        
    }

    ////////////////////////////////////

    static async batchLoadUserData(_tokens)
    {
        let batchObjects = []
        let batchCalls = []

        //get valid tokens
        const initToken = await Token.batchInit(_tokens)
        initToken.forEach((t) => 
        {
            batchObjects.push(t)
            batchCalls.push(t.makeRequest_userData())
        })
        if (batchObjects.length === 0)
        {
            return
        }

        //make multicall
        const mc = window.chef.makeMultiCall(true)
        const [ret] = await LWeb3.tryMultiCall(mc, batchCalls, "[Token] batch userInfo", "Token: userData")

        //process calls
        for (let n = 0; n < batchObjects.length; n++)
        {
            const t = batchObjects[n]
            const r = ret[n]
            await t.processRequest_userData(r)
        }
    }

    makeRequest_userData()
    {
        const con = this.getContract(true)
        return {
            userBalance: con.methods.balanceOf(window.chef.account)
        }
    }

    async processRequest_userData(_data)
    {
        this.userBalance = _data.userBalance

        //process
        this.userBalanceUSD = this.getPriceUSDForAmount(this.userBalance)

        //event
        document.dispatchEvent(new CustomEvent('token_userInfo',
        {
            detail:
            {
                address: this.address
            }
        }))
    }    

    async reloadUserData()
    {
        await this.init()
        if (!this.initialized)
        {
            return
        }

		//handle result
        const [ret] = await LWeb3.tryMultiCall(
            window.chef.makeMultiCall(true),
            [ 
                await this.makeRequest_userData()
            ],
            this.debugErrorString("userInfo"),
            "Token: userData")
        await this.processRequest_userData(ret[0])
    }

    static async batchReloadPrice(_tokens)
    {
        for (let n = 0; n < _tokens.length; n++)
        {
            const t = _tokens[n]
            await t.reloadPrice()
        }
    }

    async reloadPrice()
    {
        await window.chef.oracle.reloadPriceData(this)
    }

    ////////////////////////////////////

    async addToWallet()
	{
		try
		{
			let tokenName = (this.token1 !== null ? "LP Token" : this.name)
			let tokenIcon = (this.icon || "")
			if (tokenIcon.length > 1
				&& tokenIcon[0] === ".")
			{
				tokenIcon = window.location.origin + "/" + tokenIcon.substring(1)
			}
			let address = this.address
			let symbol = (this.symbol.length <= 11 ? this.symbol : tokenName)
			let decimals = (this.decimals < 0 ? 18 : this.decimals)
			let image = tokenIcon
			
			await window.ethereum.request(
			{
				method: 'wallet_watchAsset',
				params:
				{
					type: 'ERC20',
					options:
					{
						address,
						symbol,
						decimals,
						image
					}
				},
			})
		}
        catch(e) { }		
	}

    getPriceUSDForAmount(_amount)
    {
        const liquidityValue = window.chef.toBN(this.liquidityValue)
        const liquidityAmount = window.chef.toBN(this.liquidityAmount)
        if (liquidityAmount.cmp(window.chef.toBN(0)) === 0)
        {
            return "0"
        }

        const amount = window.chef.toBN(_amount)
        const value = liquidityValue.mul(amount).div(liquidityAmount)
        return value.toString(10)        
    }    

	getPriceShare(_amount, _percent)
	{
		const amount = window.chef.toBN(_amount)
		const pf = window.chef.toBN(window.chef.vaultChef.percentFactor)
		const percentMul = window.chef.toBN(parseInt(_percent * window.chef.vaultChef.percentFactor))
		const share = amount.mul(percentMul).div(pf)
		return share
	}    

    getAddressSortString()
    {
        if (this.isLPToken())
        {
            if (LWeb3.compareAddress(this.token0, this.token1) < 1)
            {
                return (this.token0.toLowerCase() + "-" + this.token1.toLowerCase());
            }
            return (this.token1.toLowerCase() + "-" + this.token0.toLowerCase());
        }
        return this.address.toLowerCase();
    }

    getSymbolSortString()
    {
        if (this.isLPToken())
        {
            let t0 = window.chef.findToken(this.token0)?.symbol;
            let t1 = window.chef.findToken(this.token1)?.symbol;
            if (LWeb3.compareAddress(t0, t1) < 1)
            {
                return (t0.toLowerCase() + "-" + t1.toLowerCase());
            }
            return (t1.toLowerCase() + "-" + t0.toLowerCase());
        }
        return this.symbol.toLowerCase();
    }

    isLPToken()
    {
        return (!!this.token0
            && !!this.token1)
    }

    isStable()
    {
        return (this.oracleType === "Stable")
    }

    hasStable()
    {
        if (this.isLPToken())
        {
            const t0 = window.chef.findToken(this.token0)
            const t1 = window.chef.findToken(this.token1)
            return (t0.isStable()
                || t1.isStable())
        }

        return false;
    }

    getFullName()
    {
        if (this.isLPToken())
        {
            const t0 = window.chef.findToken(this.token0)
            const t1 = window.chef.findToken(this.token1)
            return `${t0?.symbol || "???"}-${t1?.symbol || "???"}`
        }

        return this.symbol
    }

    priceUpdated()
	{
		//event
        document.dispatchEvent(new CustomEvent('token_priceInfo',
        {
            detail:
            {
                address: this.address
            }
        }))
	}

    ////////////////////////////////////

    async approve(_approveFor)
    {
        const con = this.getContract(true)
        await window.chef.trySend(
            con.methods.approve(
                _approveFor,
                window.chef.web3_data.eth.abi.encodeParameter("int256", "-1")),
            window.chef.account,
            this.debugErrorString("approve"),
            undefined,
            `Approve ${this.symbol}`)
    }

    async checkApproved(_approveFor)
	{         
        const allowance = await LWeb3.tryCall(this.getContract(true).methods.allowance(window.chef.account, _approveFor), this.debugErrorString("checkApproved"))
		return (allowance !== "0") 
	}

    async balanceOf(_address)
    {
        const con = this.getContract(false)
        return await LWeb3.tryCall(con.methods.balanceOf(_address), "balanceOf")
    }

    ////////////////////////////////////

    async db_getHistoricPrice(_filter, _forceReload)
	{
		_filter = _filter || {}

		if (_forceReload)
		{
			let data = undefined
			try
			{
				let apiURL = window.chef.api_url + "?module=token&action=getTokenPriceHistory"
                apiURL += "&chain=" + window.chef.currentChain.id
                apiURL += "&token=" + this.address
                apiURL += "&days=" + (_filter.days || 30)
                data = await LLib.fetchJSON(apiURL)
			}
			catch (e) { }

			return data
		}

		return await this.cache_tokenPriceHistory.getData(_filter)
	}

    async db_getHistoricLPFee(_filter, _forceReload)
	{
		_filter = _filter || {}

		if (_forceReload)
		{
			let data = undefined
			try
			{
				let apiURL = window.chef.api_url + "?module=token&action=getTokenLPFeeHistory"
                apiURL += "&chain=" + window.chef.currentChain.id
                apiURL += "&token=" + this.address
                apiURL += "&days=" + (_filter.days || 30)
                data = await LLib.fetchJSON(apiURL)
			}
			catch (e) { }

			return data
		}

		return await this.cache_tokenLPFeeHistory.getData(_filter)
	}

    async db_setPrice()
	{	
        let unitPriceValue = window.chef.toBN(0)
        const liquidityAmount = window.chef.toBN(this.liquidityAmount)
        const liquidityValue = window.chef.toBN(this.liquidityValue)
		if (liquidityAmount.cmp(window.chef.toBN(0)) !== 0)
		{
			unitPriceValue = liquidityValue.mul(this.one).div(liquidityAmount)
		}
        
		const unitPrice = parseFloat(LWeb3.fullFormatTokens(unitPriceValue.toString(10), window.chef.stableToken))

		//write to db
        if (unitPrice !== 0)
		{
			let apiURL = window.chef.api_url + "?module=token&action=setTokenPrice"		
			apiURL += "&chain=" + window.chef.currentChain.id
			apiURL += "&token=" + this.address
			apiURL += "&timestamp=" + parseInt(((new Date()).getTime() / 1000))
			apiURL += "&price=" + unitPrice.toFixed(8)
            apiURL += "&totalSupply=" + LWeb3.abiEncodeUint256(window.chef.toBN(this.totalSupply))
			apiURL += "&liquidityAmount=" + LWeb3.abiEncodeUint256(liquidityAmount)
            apiURL += "&liquidityValue=" + LWeb3.abiEncodeUint256(liquidityValue)    
            if (this.isLPToken())
            {
                apiURL += "&token0Reserve=" + LWeb3.abiEncodeUint256(window.chef.toBN(this.token0Reserve))    
                apiURL += "&token1Reserve=" + LWeb3.abiEncodeUint256(window.chef.toBN(this.token1Reserve))    
            }        
			await LLib.fetch(apiURL)		
		}
	}

    ////////////////////////////////////
}

export default Token;