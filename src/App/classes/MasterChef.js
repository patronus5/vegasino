//libs
import {LLib} from '../libs/LLib';
import {LWeb3} from '../libs/LWeb3';

//contracts
import {ABI_MasterChef} from './../contracts/MasterChef';

class MasterChef
{
	constructor(_address)
	{	
		//init
		this.address = _address
		this.initialized = false

		//singleton
		window.masterChef = this

		//values
		this.percentFactor = 100000
		
		//data
		this.rewardToken = ""
		this.totalAllocPoints = "0"
		this.emissionPerBlock = "0"
		this.depositFee = 0
		this.withdrawFee = 0	
	}
	
	debugErrorString(_text)
	{
		return 'MasterChef failed at: ' + _text		
	}

	getContract(_user)
    {       
        let web3 = LWeb3.findWeb3Connection((!!_user ? 'user' : 'data')).web3
        let con = new web3.eth.Contract(ABI_MasterChef, this.address)
        return con
    }
	
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
				//withdrawFee: con.methods.withdrawFee()
				rewardToken: con.methods.NEVADA(),
				totalAllocPoint: con.methods.totalAllocPoint(),
				emissionPerBlock: con.methods.tokenPerBlock()
            }
        ]

		//handle result
        const [ret] = await LWeb3.tryMultiCall(mc, calls, this.debugErrorString("init"))
        const res =  ret[0]		
		//this.withdrawFee = parseFloat(res.withdrawFee) / this.percentFactor
		this.totalAllocPoints	= res.totalAllocPoint
		this.rewardToken 		= res.rewardToken
		this.emissionPerBlock	= res.emissionPerBlock

		//complete
		this.initialized = true
	}

	////////////////////////////////////

	async withdraw(_id, _amount, _description)
	{
		let con = this.getContract(true)
		await window.chef.trySend(con.methods.withdraw(_id, _amount), window.chef.account, this.debugErrorString("withdraw"), undefined, _description)
	}
	
	async deposit(_id, _amount, _description)
	{
		let con = this.getContract(true)
		await window.chef.trySend(con.methods.deposit(_id, _amount), window.chef.account, this.debugErrorString("deposit"), undefined, _description)
	}

	////////////////////////////////////
}

export default MasterChef;