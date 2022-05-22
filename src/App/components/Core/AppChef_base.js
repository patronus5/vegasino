import React from 'react'
import { toast } from 'react-toastify'

//config
import { config, Template } from '../../config'

//libs
import {LLib} from '../../libs/LLib'
import {LWeb3} from '../../libs/LWeb3'

//classes
import Token from '../../classes/Token'
import Router from '../../classes/Router'
import Oracle from '../../classes/Oracle'

//components
import { Text } from '../Controls'

//modals
import ModalTransaction from '../Modals/ModalTransaction/ModalTransaction'

class AppChef_base extends React.Component
{
	constructor(props)
	{   
		super(props)

        //singleton        
        window.chef = this
		
		//init
        this.refreshCount = 0
        this.template = null
        this.walletInstalled = false
		this.chainID = 0
        this.web3_data = null
        this.web3_user = null
        this.account = null
        this.currentChain = null
        this.currentBlock = 0
        this.chains = []      
        this.depositTokens = []     
        this.depositAssets = []   
        this.user = null
        this.stableToken = null
        this.wrappedCoin = null
        this.transactionCounter = 1
        this.transactions = []
        this.dataVersion = ((new Date()).getTime() / 1000)

        //config
        this.defaultChain = config.page.defaultChain

        //classes
        this.oracle = new Oracle()
        this.tokens = []
        this.routers = []

        //runtime data
        this.userCoinBalance = "0"
        this.userCoinBalanceUSD = 0
        this.avgGasPrice = 0

        //vars
        this.interval_refresh = null
	}

    async componentDidMount()
	{		
		await this.initApp()
		
        //intervals
		this.interval_refresh = setInterval(() => this.refreshData(), 10000) //10 secs (data will check caching on its own)
	}
	
	componentWillUnmount()
	{			
        if (this.interval_refresh !== null)
        {
		    clearInterval(this.interval_refresh)
        }
	}

    async refreshChainData()
    {
        //token prices
        await this.refreshData_tokens() 
    }

    async refreshData()
    {
        if (this.web3_data !== null)
        {   
            //gas price & current block
            this.avgGasPrice = parseFloat(this.web3_data.utils.fromWei(await this.web3_data.eth.getGasPrice(), "gwei").toString()).toFixed(2)   
            this.currentBlock = await this.web3_data.eth.getBlockNumber() 

            //chain data
            await LLib.measureTime(`TM: AppRefresh #${this.refreshCount}`, async () => 
            {
                await this.refreshChainData()
            })
        }
        else if (this.web3_user !== null) //user selected unsupported chain
        {         
            //gas price & current block            
            this.avgGasPrice = parseFloat(this.web3_user.utils.fromWei(await this.web3_user.eth.getGasPrice(), "gwei").toString()).toFixed(2)
            this.currentBlock = await this.web3_user.eth.getBlockNumber() 
        }

        //complete
        this.refreshCount += 1

        //event        
        document.dispatchEvent(new CustomEvent('app_reload'))
    }

    async refreshData_tokens()
    {
        this.tokens.sort((_a, _b) => //ensure correct order for oracle
        {
            const oracleTypeOrder =
            [
                "Stable",
                "LPStable",
                "LPCoin",
                "LPMirror",
                "Alias",
                "LP"
            ]

            const idxA = oracleTypeOrder.indexOf(_a.oracleType)
            const idxB = oracleTypeOrder.indexOf(_b.oracleType)
            if (idxA === idxB)
            {
                return (_a.address > _b.address ? 1 : -1)
            }
            return (idxA > idxB ? 1 : -1)
        })

        //init all
        let tokensInit = []
        await LLib.measureTime(`TM: TokenInit ${this.tokens.length}`, async () => 
        {
            tokensInit = await Token.batchInit(this.tokens)
        }) 

        //load price & pair info
        const tokensGetPrice = tokensInit.filter(t => !this.isSpecialToken(t))
        await LLib.measureTime(`TM: TokenPairInfo ${tokensGetPrice.length}`, async () => 
        {
            await Token.batchLoadPairInfo(tokensGetPrice)
        })          
        await LLib.measureTime(`TM: OracleTokenPairs ${tokensGetPrice.length}`, async () => 
        {
            await Oracle.batchLoadPricePairs(tokensGetPrice)
        })        
        await LLib.measureTime(`TM: TokenPrice ${tokensGetPrice.length}`, async () => 
        {
            await Token.batchReloadPrice(tokensGetPrice)
        })

        //load user balance
        if (this.account !== null)
        {
            await LLib.measureTime(`TM: TokenUser ${tokensGetPrice.length}`, async () => 
            {
                const tokensUserBalance = tokensInit.filter(t => this.isSpecialToken(t) || this.depositTokens.includes(t))
                await Token.batchLoadUserData(tokensUserBalance)
            })

            //coin balance
            if (this.currentChain !== null)
            {
                this.userCoinBalance = await this.web3_user.eth.getBalance(this.account)
                this.userCoinBalanceUSD = this.wrappedCoin.getPriceUSDForAmount(this.userCoinBalance)
            }
        }
    }

    isSpecialToken(_token)
    {
        return (_token.address === window.chef.moonChef?.moonToken?.address)
    }

    selectWeb3Connection(_user)
    {        
        const web3 = LWeb3.findWeb3Connection(this.selectWeb3ConnectionID(_user)).web3;
        return web3;
    }

    selectWeb3ConnectionID(_user)
    {
        let conID = (!!_user ? 'user' : 'data');
        if (config.settings.alwaysUseUserWeb3
            && this.web3_user !== null)
        {
            conID = 'user';
        }

        return conID;
    }

    makeMultiCall(_user)
	{
        return LWeb3.makeMultiCall(this.selectWeb3ConnectionID(_user));
    }
    
    async initWeb3()
    {
        //connect web3
        LWeb3.initWeb3Data(config.web3Data);
        this.web3_user = null;
        if (!LLib.getStorage_bool(false, 'web3_disconnected', false)
            && LLib.getStorage(false, 'web3_provider', 'MetaMask') !== 'none')
        {
            try
            {
                await LWeb3.selectProvider(LLib.getStorage(false, 'web3_provider', 'MetaMask'));    
                this.web3_user = await LWeb3.createAndConnectWeb3Connection('user', -1);                    
            }
            catch (_e) { }
        }
        this.chainID = (this.web3_user === null ? LLib.getStorage_int(false, 'web3_selectedChain', this.defaultChain) : await this.web3_user.eth.net.getId());
        try
        {
            this.web3_data = await LWeb3.createAndConnectWeb3Connection('data', this.chainID);
        }
        catch (_e)
        {
            //try fallback to user connection
            console.error("Web3 [data] failed to connect");
            this.web3_data = this.web3_user;
        }

        //init web3
        if (window.ethereum)
        {
            this.walletInstalled = true;

            //add event listener [account change]
            window.ethereum.on('accountsChanged', function()
            {
                window.location.reload();
            });
            
            //add event listener [chain change]
            window.ethereum.on('chainChanged', function()
            {
                window.location.reload();
            }); 
            
            //add event listener [disconnect]
            window.ethereum.on('disconnect', function()
            {
                window.location.reload();
            });  

            //connect to wallet        
            await this.connectToWallet();
        }

        //event
        document.dispatchEvent(new CustomEvent('chef_connectedToWeb3'));
    }

    async initChainData()
    {
        //init router
        const jsonRouters = await LLib.fetchJSON(`./data/${this.currentChain.name}/routers.json?v=${this.dataVersion}`);
        for (let n = 0; n < jsonRouters.length; n++)
        {
            let r = jsonRouters[n];
            this.routers.push(new Router(r));
        }

        //init tokens
        const jsonTokens = await LLib.fetchJSON(`./data/${this.currentChain.name}/tokens.json?v=${this.dataVersion}`);
        for (let n = 0; n < jsonTokens.length; n++)
        {
            let t = jsonTokens[n];
            this.tokens.push(new Token(t));
        }
        this.stableToken = this.findToken(this.currentChain.stableCoin);
        this.wrappedCoin = this.findToken(this.currentChain.wrappedCoin);
    }

    async initApp()
    {
        await this.initWeb3();        

        //load data
		this.chains = await LLib.fetchJSON(`./data/chains.json?v=${this.dataVersion}`);
        this.currentChain = this.findChain(this.chainID);
		if (this.currentChain === null)
		{
            this.error('Invalid System', true);
		} 
        else
        {
            await this.initChainData();
        }        
            
        await this.initComplete();

        //event
        document.dispatchEvent(new CustomEvent('chef_dataLoaded'));
    }

    async initComplete()
    {
        await this.refreshData();
    }

    async connectToWallet(_askAgain)
    {
        //get user accounts	  
        if (!LLib.getStorage_bool(false, 'web3_disconnected', false))
        {
            if (_askAgain)
            {            
                if (LLib.getStorage(false, 'web3_provider', 'MetaMask') !== 'WalletConnect')
                {
                    await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }]})
                }
                else
                {
                    await LWeb3.closeProvider();
                }
            }
            else
            {
                try
                {
                    await window.ethereum.request({ method: 'eth_requestAccounts' })
                }
                catch (e)
                {
                    //user rejected connection, so let him logged out
                    LLib.setStorage(false, 'web3_disconnected', true);
                }
            }
        }

        //get account
        if (this.web3_user !== null)
        {
            const accounts = await this.web3_user.eth.getAccounts()
            if (accounts.length > 0)
            {
                this.account = accounts[0] 
            }
        }
        if (!_askAgain
            && (this.web3_user === null
                || this.account === null))
        {
            //fallback solution to not annoy users if login failed
            LLib.setStorage(false, 'web3_disconnected', true);        
        }
    }

    error(_text, _throw)
    {
        if (_throw === undefined)
        {
            _throw = false
        }

        //build text
        let et = '[AppChef] ' + _text

        //error
        if (_throw)
        {
            console.error(et)
        }
        else
        {
            throw et
        }
    }

    addDepositAsset(_token)
    {
        if (_token !== null
            && !this.depositAssets.includes(_token)
            && !this.isSpecialToken(_token))
		{
            this.depositAssets.push(_token);
            this.depositAssets.sort((_a, _b) => (_a.symbol < _b.symbol ? -1 : (_a.symbol > _b.symbol ? 1 : 0)));
        }
    }

    addDepositToken(_token)
    {
        if (_token !== null
            && !this.depositTokens.includes(_token))
		{
			this.depositTokens.push(_token);
            if (_token.isLPToken())
            {
                this.addDepositAsset(this.findToken(_token.token0));
                this.addDepositAsset(this.findToken(_token.token1));
            }
            else
            {
                this.addDepositAsset(_token);
            }
		}
    }

    findChain(_id)
	{
		let chain = this.chains.find((c) => c.id === _id)		
		return (chain === undefined ? null : chain)
	}

    findRouter(_idOrContract)
	{
		if (!_idOrContract)
		{
			return null
		}
		let router = this.routers.find((r) => r.id === _idOrContract || r.address.toLowerCase() === _idOrContract.toLowerCase())		
		return (router || null)
	}
	
	findRouterForToken(_token)
	{
		return this.findRouter(_token.router)
	}

	findToken(_contractOrSymbol)
	{
		if (!_contractOrSymbol)
		{
			return null
		}
        _contractOrSymbol = _contractOrSymbol.toLowerCase() 		

		const token = this.tokens.find((t) => t.address.toLowerCase() === _contractOrSymbol || t.symbol.toLowerCase() === _contractOrSymbol)		
		return (token || null)
	}

    findTransaction(_txHashOrId)
    {
        if (!_txHashOrId)
        {
            return null
        }
        if (typeof(_txHashOrId) === "string")
        {
            _txHashOrId = _txHashOrId.toLowerCase() 	
        }

        const tx = this.transactions.find((t) => t.hash.toLowerCase() === _txHashOrId || t.id === _txHashOrId)		
		return (tx || null)
    }

    makeToast(_text, _success)
    {
        if (_success === undefined)
        {
            _success = true
        }

        const opts = 
        {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "dark"
        }
        if (_success)
        {
            toast.success(_text, opts)
        }
        else
        {
            toast.error(_text, opts)
        }
    }

    async trySend(_callPromise, _from, _errorMsg, _default, _transactionDescription, _coinValue)
	{
        //create transaction
        const transID = this.transactionCounter
        this.transactionCounter += 1
        this.transactions.push(
        {
            id: transID,
            hash: "",
            stage: 1,
            description: _transactionDescription || "",
            receipt: null,
            error: null
        })

        //show modal
        ModalTransaction.showModal(transID)

        //send
        console.log(`[Transaction] ${transID} started`)
        return await LWeb3.trySend(
            _callPromise,
            _from,
            _errorMsg,
            _default,
            (_txHash) =>
            {
                //transaction was confirmed from user and is send to blockchain
                console.log(`[Transaction] ${transID} pending`)
                let tx = this.findTransaction(transID)
                tx.hash = _txHash
                ModalTransaction.setTransactionStage(transID, 1, _txHash)
            },
            (_receipt) =>
            {
                //a receipt is available to check the state
                console.log(`[Transaction] ${transID} receipt available`)
                let tx = this.findTransaction(transID)
                tx.receipt = _receipt
                //ModalTransaction.setTransactionStage(transID, 2, _receipt)
            },
            (_confirmations, _receipt) =>
            {
                //it was mined and confirmed
                console.log(`[Transaction] ${transID} mined`)
                let tx = this.findTransaction(transID)
                tx.stage = 3
                tx.receipt = _receipt
                ModalTransaction.setTransactionStage(transID, 3, _receipt)
                this.makeToast(
                    <>
                        Transaction complete!
                        <br />
                        <Text size="-1">
                            {tx.description}
                        </Text>                           
                    </>, true)
            },
            (_error) =>
            {
                //error occured
                console.log(`[Transaction] ${transID} failed`)
                let tx = this.findTransaction(transID)
                tx.stage = -1
                tx.error = _error
                ModalTransaction.setTransactionStage(transID, -1, _error)
                //this.makeToast(<>Transaction failed!<br /><Text size="-1">{tx.description}</Text></>, false)
            },
            _coinValue)
	}

    toBN(_number)
    {
        return (this.web3_data === null ? this.web3_user.utils.toBN(_number) : this.web3_data.utils.toBN(_number))
    }

    render()
	{
		return (
            <>
                <Template animateMenuGlow={config.template.useMenuGlow} />
            </>
        )
	}
}

export default AppChef_base;