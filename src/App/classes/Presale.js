//libs
import {LWeb3} from '../libs/';

//contracts
import {ABI_Presale} from '../contracts/Presale';
import {ABI_PresaleToken} from '../contracts/PresaleToken';

class Presale
{
    ////////////////////////////////////

	constructor(_contract, _id = "")
	{	
        this.initialized = false;
        this.initializedUser = false;

		//base values
		this.address = _contract;

        //info
        this.id = _id;
        this.pricePerUnit = "0";
        this.forSale = 0;
        this.sold = 0;
        this.saleStartTime = 0;
        this.whitelistDuration = 0;
        this.whitelistUnitsPerUser = 0;
        this.availableSupply = 0;
        this.saleStartTimeUTC = null
        this.whitelistEndTimeUTC = null
        this.homeChain = 56
        this.approved = this.isMainChain();
        this.wrappedBNB = "";

        //user
        this.whitelisted = false;
        this.bought = 0;      
        this.userAvailable = 0;    
	}

    ////////////////////////////////////
	
	debugErrorString(_text)
	{
		return 'Presale failed at: ' + _text		
	}

    getContract(_user)
    {        
        const web3 = window.chef.selectWeb3Connection(_user)
        const con = new web3.eth.Contract((this.isMainChain() ? ABI_Presale : ABI_PresaleToken), this.address)
        return con
    }

    isMainChain()
    {
        return (window.chef.currentChain.id === this.homeChain
            || window.chef.currentChain.id === 97);
    }

    ////////////////////////////////////

    makeRequest_init()
    {
        const con = this.getContract()
        let call = {
            pricePerUnit: con.methods.pricePerUnit(),
            saleStartTime: con.methods.saleStartTime(),
            whitelistUnitsPerUser: con.methods.whitelistUnitsPerUser(),
            whitelistDuration: con.methods.WHITELIST_PRESALE_DURATION() 
        }
        if (!this.isMainChain())
        {
            call.wrappedBNB = con.methods.wrappedBNB()
        }

        return call
    }

    async processRequest_init(_data)
    {
        this.pricePerUnit = _data.pricePerUnit
        this.saleStartTime = parseInt(_data.saleStartTime)
        this.whitelistUnitsPerUser = parseInt(_data.whitelistUnitsPerUser)
        this.whitelistDuration = parseInt(_data.whitelistDuration)
        if (!this.isMainChain())
        {
            this.wrappedBNB = _data.wrappedBNB;
        }

        //process
        this.saleStartTimeUTC = new Date(this.saleStartTime * 1000)
        this.whitelistEndTimeUTC = new Date((this.saleStartTime + this.whitelistDuration) * 1000)

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
            "Presale: init")
        await this.processRequest_init(ret[0])        
	}

    ////////////////////////////////////

    makeRequest_info()
    {
        const con = this.getContract()
        return {
            forSale: con.methods.getTotalSupply(),
            sold: con.methods.sold(),
            availableSupply: con.methods.getAvailableSupply()
        }
    }

    async processRequest_info(_data)
    {
        this.forSale = parseInt(_data.forSale)
        this.sold = parseInt(_data.sold)
        this.availableSupply = parseInt(_data.availableSupply)

        //event
        document.dispatchEvent(new CustomEvent('presale_info'))
    }    

    async reloadInfo()
    {
        await this.init()
        if (!this.initialized)
        {
            return
        }

		//handle result
        const [ret] = await LWeb3.tryMultiCall(
            window.chef.makeMultiCall(false),
            [
                this.makeRequest_info()
            ],
            this.debugErrorString("info"),
            "Presale: info")
        await this.processRequest_info(ret[0])        
    }

    ////////////////////////////////////

    makeRequest_userData()
    {
        const con = this.getContract(true)
        let request = {
            userInfo: con.methods.getUserInfo(window.chef.account),
            userAvailable: con.methods.getUserAvailableSupply(window.chef.account)
        }
        if (!this.isMainChain())
        {
            request.approved = con.methods.checkApproved(window.chef.account)
        }

        return request;
    }

    async processRequest_userData(_data)
    {
        this.bought = parseInt(_data.userInfo[1]); 
        this.whitelisted = _data.userInfo[2];           
        this.userAvailable = parseInt(_data.userAvailable)
        if (!this.isMainChain())
        {
            this.approved = _data.approved;
        }

        //comlete
        this.initializedUser = true;

        //event
        document.dispatchEvent(new CustomEvent('presale_userInfo'))
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
            "Presale: userData")
        await this.processRequest_userData(ret[0])
    }

    ////////////////////////////////////

    async buy(_amount)
    {
        const unitPrice = window.chef.toBN(this.pricePerUnit);
        const amount = window.chef.toBN(_amount);
        const price = unitPrice.mul(amount);

        const con = this.getContract(true)
        await window.chef.trySend(
            con.methods.buy(_amount),
            window.chef.account,
            this.debugErrorString("buy"),
            undefined,
            `buy ${_amount} NFT${_amount > 1 ? "s" : ""}`,
            (this.isMainChain() ? price.toString(10) : undefined))
    }

    async approve()
    {
        let token = window.chef.findToken(this.wrappedBNB);
        await token.approve(this.address);
    }

    ////////////////////////////////////

    getPhase()
    {
        const now = (new Date()).getTime();
		if (now >= this.whitelistEndTimeUTC.getTime())
		{
			return 2;
		}
		else if (now > this.saleStartTimeUTC.getTime())
		{
			return 1;
		}

        return 0;
    }

    ////////////////////////////////////
}

export default Presale;