//libs
import {LWeb3} from '../libs/LWeb3';

//contracts
import {ABI_Migrator} from './../contracts/Migrator';

class Migrator
{
	constructor(_address)
	{	
		//init
		this.address = _address
		this.initialized = false
        this.userInitialized = false
		
		//data
		this.oldTokenAddress = ""
        this.oldToken = null
		this.allowance = "0"
        this.approved = false	
	}
	
	debugErrorString(_text)
	{
		return 'Migrator failed at: ' + _text		
	}

	getContract(_user)
    {       
        let web3 = LWeb3.findWeb3Connection((!!_user ? 'user' : 'data')).web3
        let con = new web3.eth.Contract(ABI_Migrator, this.address)
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
				oldToken: con.methods.oldToken()
            }
        ]

		//handle result
        const [ret] = await LWeb3.tryMultiCall(mc, calls, this.debugErrorString("init"))
        const res =  ret[0]		
		this.oldTokenAddress	= res.oldToken

        //additional
        this.oldToken = window.chef.findToken(this.oldTokenAddress);

		//complete
		this.initialized = true

        //event
        document.dispatchEvent(new CustomEvent('migrator_init'))
	}

    async reloadUser()
	{	
		await this.init()
        if (!this.initialized
			|| window.chef.account === null)
        {
            return
        }

		//make multicall
        let mc = LWeb3.makeMultiCall("data")
        let con = this.getContract()
        let calls =
        [ 
            {				
				allowance: con.methods.allowances(window.chef.account)
            }
        ]

		//handle result
        const [ret] = await LWeb3.tryMultiCall(mc, calls, this.debugErrorString("user"))
        const res =  ret[0]		
		this.allowance	= res.allowance

        if (!this.approved
            && this.oldToken !== null)
        {
            this.approved = await this.checkApproved();
        }

		//complete
		this.userInitialized = true

        //event
        document.dispatchEvent(new CustomEvent('migrator_user'))
	}

	////////////////////////////////////

    async checkApproved()
	{
		return await this.oldToken.checkApproved(this.address)
	}

	async approve()
	{
		await this.oldToken.approve(this.address)
	}

	async migrate()
	{
		let con = this.getContract(true)
		await window.chef.trySend(con.methods.Migrate(), window.chef.account, this.debugErrorString("migrate"), undefined, "Migrate")
	}

	////////////////////////////////////
}

export default Migrator;