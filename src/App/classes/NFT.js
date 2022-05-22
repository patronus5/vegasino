//libs
import {LWeb3, LLib} from '../libs';

//contracts
import {ABI_NFT} from '../contracts/NFT';

class NFT
{
    ////////////////////////////////////

	constructor(_contract, _id = "")
	{	
        this.initialized = false;
        this.initializedUser = false;

		//base values
		this.address = _contract;

        //info
        this.totalSupply = 0;
        this.nfts = [];
        this.userBalance = 0;
        this.userNFTs = [];       
        this.ipfsGateway = "https://ipfs.io/ipfs/";
        this.localRedirectImages = "assets/NFTs/images/";
        this.localRedirectJSONs = "assets/NFTs/json/";
        this.useLocalRedirect = true;
        this.specialMintCount = 22;
        this.localRedirectSpecialImages = "assets/NFTs/specialMints/images/";
        this.localRedirectSepcialJSONs = "assets/NFTs/specialMints/json/";
	}

    ////////////////////////////////////
	
	debugErrorString(_text)
	{
		return 'NFT failed at: ' + _text		
	}

    getContract(_user)
    {        
        const web3 = window.chef.selectWeb3Connection(_user)
        const con = new web3.eth.Contract(ABI_NFT, this.address)
        return con
    }

    ////////////////////////////////////

    makeRequest_init()
    {
        const con = this.getContract()
        let call = {
            totalSupply: con.methods.totalSupply()
        }

        return call
    }

    async processRequest_init(_data)
    {
        this.totalSupply = parseInt(_data.totalSupply)

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
            "NFT: init")
        await this.processRequest_init(ret[0])        
	}

    ////////////////////////////////////

    makeRequest_info()
    {
        const con = this.getContract()
        return {
            totalSupply: con.methods.totalSupply()
        }
    }

    async processRequest_info(_data)
    {
        this.totalSupply = parseInt(_data.totalSupply)

        //event
        document.dispatchEvent(new CustomEvent('nft_info'))
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
            "NFT: info")
        await this.processRequest_info(ret[0])        
    }

    ////////////////////////////////////

    makeRequest_userData()
    {
        const con = this.getContract(true)
        let request = {
            userBalance: con.methods.balanceOf(window.chef.account)
        }

        return request;
    }

    async processRequest_userData(_data)
    {
        this.userBalance = parseInt(_data.userBalance);

        //comlete
        this.initializedUser = true;

        //event
        document.dispatchEvent(new CustomEvent('nft_userInfo'))
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
            "NFT: userData")
        await this.processRequest_userData(ret[0])
    }

    ////////////////////////////////////

    async batchLoadUserNFTs(_from, _to)
    {
        let batchObjects = []
        let batchCalls = []

        //get valid tokens
        for (let n = _from; n < _to; n++)
        {
            batchObjects.push(n)
            batchCalls.push(this.makeRequest_loadUserNFT(n))
        }
        if (batchObjects.length === 0)
        {
            return
        }

        //make multicall
        const mc = window.chef.makeMultiCall(true)
        const [ret] = await LWeb3.tryMultiCall(mc, batchCalls, "[NFT] batch loadUserNFT", "NFT: loadUserNFT")

        //process calls
        for (let n = 0; n < batchObjects.length; n++)
        {
            const t = batchObjects[n]
            const r = ret[n]
            await this.processRequest_loadUserNFT(t, r)
        }
    }

    makeRequest_loadUserNFT(_id)
    {
        const con = this.getContract(true)
        return {
            index: con.methods.tokenOfOwnerByIndex(window.chef.account, _id)
        }
    }

    async processRequest_loadUserNFT(_id, _data)
    {
        if (!this.userNFTs.includes(parseInt(_data.index)))
        {
            this.userNFTs.push(parseInt(_data.index));
            this.findOrCreateNFT(parseInt(_data.index)).load = true;
        }

        //event
        document.dispatchEvent(new CustomEvent('nft_loadUserNFT',
        {
            detail:
            {
                address: this.address
            }
        }))
    }    

    async reloadUserNFT()
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
                await this.makeRequest_loadNFT()
            ],
            this.debugErrorString("loadUserNFT"),
            "NFT: loadUserNFT")
        await this.processRequest_loadUserNFT(ret[0])
    }

    ////////////////////////////////////

    async batchLoadNFTs(_from, _to)
    {
        let batchObjects = []
        let batchCalls = []

        //get valid tokens
        for (let n = _from; n < _to; n++)
        {
            batchObjects.push(n)
            batchCalls.push(this.makeRequest_loadNFT(n))
        }
        if (batchObjects.length === 0)
        {
            return
        }

        //make multicall
        const mc = window.chef.makeMultiCall(true)
        const [ret] = await LWeb3.tryMultiCall(mc, batchCalls, "[NFT] batch loadNFT", "NFT: loadNFT")

        //process calls
        for (let n = 0; n < batchObjects.length; n++)
        {
            const t = batchObjects[n]
            const r = ret[n]
            await this.processRequest_loadNFT(t, r)
        }
    }

    makeRequest_loadNFT(_id)
    {
        const con = this.getContract(true)
        return {
            tokenURI: con.methods.tokenURI(_id)
        }
    }

    async processRequest_loadNFT(_id, _data)
    {
        let nft = this.findOrCreateNFT(_id);
        nft.uri = this.modifyIPFS(_data.tokenURI, true, nft.id < this.specialMintCount); 

        //event
        document.dispatchEvent(new CustomEvent('nft_loadNFT',
        {
            detail:
            {
                address: this.address
            }
        }))
    }    

    async reloadNFT()
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
                await this.makeRequest_loadNFT()
            ],
            this.debugErrorString("loadNFT"),
            "NFT: loadNFT")
        await this.processRequest_loadNFT(ret[0])
    }

    async batchLoadNFTURI()
    {
        this.nfts.forEach(async (nft) =>
        {
            if (nft.uri !== ""
                && nft.uri !== "\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02"
                && nft.json === null
                && nft.load === true)
            {
                try
                {
                    nft.json = await LLib.fetchJSON(nft.uri);
                    nft.json.image = this.modifyIPFS(nft.json.image, false, nft.id < this.specialMintCount);
                }
                catch (e) { }
            }            
        });
    }

    ////////////////////////////////////

    findNFT(_id)
    {
        return (this.nfts.find(n => n.id === parseInt(_id)) || null);
    }

    findOrCreateNFT(_id)
    {
        let nft = this.findNFT(_id);
        if (nft === null)
        {
            nft = {
                id: parseInt(_id),
                uri: "",
                json: null,
                load: false
            };
            this.nfts.push(nft);
        }
        return nft;
    }

    modifyIPFS(_path, _jsons, _special)
    {
        const uriParts = _path.split('ipfs/');
        const pathParts = uriParts[uriParts.length - 1].split('/');
        let ret = this.ipfsGateway + uriParts[uriParts.length - 1];
        if (this.useLocalRedirect)
        {
            if (!!_jsons)
            {
                if (this.localRedirectJSONs !== "")
                {
                    ret = `${window.location.origin}/${(!_special ? this.localRedirectJSONs : this.localRedirectSepcialJSONs)}/${pathParts[pathParts.length - 1]}`;
                }
            }
            else
            {
                if (this.localRedirectImages !== "")
                {
                    ret = `${window.location.origin}/${(!_special ? this.localRedirectImages : this.localRedirectSpecialImages)}/${pathParts[pathParts.length - 1]}`;
                }
            } 
        }
        return ret;
    }

    ////////////////////////////////////
}

export default NFT;