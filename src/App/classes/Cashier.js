//libs
import {LWeb3} from '../libs/LWeb3'

import {config} from '../config';

//contracts
import {ABI_Cashier} from './../contracts/Cashier';

class Cashier
{
	////////////////////////////////////

	constructor(_contract)
	{
		//init
		this.initializedInfo = false

        //data
        this.address = _contract
		
		//values
		this.startTime = 0
        this.endTime = 0
        this.buyingEnabled = false

        //runtime
        this.startTimeUTC = null
        this.endTimeUTC = null
	}

	////////////////////////////////////
	
	debugErrorString(_text)
	{
		return 'Cashier failed at: ' + _text		
	}

	getContract(_user)
    {       
        let web3 = LWeb3.findWeb3Connection((!!_user ? 'user' : 'data')).web3
        let con = new web3.eth.Contract(ABI_Cashier, this.address)
        return con
    }

	////////////////////////////////////

	async reloadInfo()
	{
		//make multicall
        let mc = LWeb3.makeMultiCall("data")
        let con = this.getContract()
        let calls =
        [ 
            {
                startTime: con.methods.startTime(),		
                endTime: con.methods.endTime(),
                buyingEnabled: con.methods.buyingEnabled()
            }
        ]

		//handle result
        const [ret] = await LWeb3.tryMultiCall(mc, calls, this.debugErrorString("cashierInfo"))
        const res = ret[0]
        this.startTime 			= parseInt(res.startTime)
        this.endTime 			= parseInt(res.endTime)
        this.buyingEnabled 		= res.buyingEnabled

		//process
        this.startTimeUTC = new Date(this.startTime * 1000)
        this.endTimeUTC = new Date(this.endTime * 1000)		

		//complete
		this.initializedInfo = true

		//event
        document.dispatchEvent(new CustomEvent('cashier_info'))
	}

	////////////////////////////////////	

	async checkApproved()
	{
        const token = window.chef.findToken(config.page.nativeToken)
		return await token.checkApproved(this.address)
	}

	async approve()
	{
        const token = window.chef.findToken(config.page.nativeToken)
		await token.approve(this.address)
	}

	async buy(_amount)
	{
        const con = this.getContract(true)
		const amountStr = LWeb3.smartFormatTokens(window.chef.toBN(_amount), window.chef.wrappedCoin, true)
        await window.chef.trySend(con.methods.buy(), window.chef.account, this.debugErrorString("buy"), undefined, `Buy for ${amountStr}`, _amount)
	}

	////////////////////////////////////
}

export default Cashier;