import Web3 from 'web3';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { MultiCall } from 'eth-multicall'

//libs
import {LLib} from './LLib.js';

//////////////////////////////////////////
//LWeb3
export const LWeb3 =
{
	compareAddress(_a, _b)
	{
		_a = (typeof(_a) !== "string" ? "" : _a.toLowerCase())
		_b = (typeof(_b) !== "string" ? "" : _b.toLowerCase())
		if (_a === ""
			&& _b === "")
		{
			return -1
		}

		if (_a > _b)
		{
			return 1
		}
		else if (_a < _b)
		{
			return -1
		}

		return 0
	},

	checkEqualAddress(_a, _b)
	{
		return (this.compareAddress(_a, _b) === 0)
	},

	//////////////////////////////////////////
	//convert
	convertTokensToFloatString: function(_value, _tokenDecimals) 
	{
		//default
		if (_value === undefined)
		{
			_value = '0'
		}
		if (_tokenDecimals === undefined)
		{
			_tokenDecimals = 18
		}			
		
		_value = _value.toString()		
		if (_value.length <= _tokenDecimals)
		{
			_value = _value.padStart(_tokenDecimals + 1, '0')
		}		
		_value = _value.substring(0, _value.length - _tokenDecimals) + '.' + _value.substring(_value.length - _tokenDecimals)
		var offset = _value.length - _tokenDecimals		
		_value = _value.substring(0, offset)
		
		//remove trailing '0' and '.'
		_value = LLib.removeTrailStart(_value, '0')
		if (_value === '')
		{
			return '0';
		}
		else if (_value[0] === '.')
		{
			_value = '0' + _value
		}
		
		return _value
	},

	convertTokensToFloat: function(_value, _tokenDecimals) 
	{
		return parseFloat(this.convertTokensToFloatString(_value, _tokenDecimals))
	},

	//////////////////////////////////////////
	//formatting
	formatTokens: function(_value, _decimals, _shorten, _tokenDecimals) 
	{
		//default
		if (_value === undefined)
		{
			_value = '0'
		}
		if (_tokenDecimals === undefined)
		{
			_tokenDecimals = 18
		}

		if (typeof _tokenDecimals !== 'number') {
			_tokenDecimals = parseInt(_tokenDecimals);
		}

		if (_decimals === undefined)
		{
			_decimals = Math.min(8, _tokenDecimals)
		}				
		
		_value = _value.toString()		
		if (_value.length <= _tokenDecimals)
		{
			_value = _value.padStart(_tokenDecimals + 1, '0')
		}		
		_value = _value.substring(0, _value.length - _tokenDecimals) + '.' + _value.substring(_value.length - _tokenDecimals)
		var offset = _value.length - (_tokenDecimals - _decimals)		
		_value = _value.substring(0, offset)
		
		//remove trailing '0' and '.'
		_value = LLib.removeTrailStart(_value, '0')
		if (_shorten === true)
		{
			_value = LLib.removeTrailEnd(_value, '0')
			_value = LLib.removeTrailEnd(_value, '.')
		}
		if (_value === '')
		{
			return '0';
		}
		else if (_value[0] === '.')
		{
			_value = '0' + _value
		}
		
		return _value
	},

	smartFormatTokensDisplay: function(_value, _token, _shorten)
	{
		const unformatted = this.smartFormatTokens(_value, _token, _shorten);
		return LLib.smartFormatFloatDisplay(unformatted, _shorten, 0, 18);
	},

	smartFormatTokens: function(_value, _token, _shorten)	
	{
		if (_value === undefined)
		{
			_value = '0'
		}	
		let maxDecimals = (!!_token && _token.decimals !== undefined ? _token.decimals : 18)
		let precision = Math.min(maxDecimals, ((_value.length <= 18) ? 8 : 4))
	
		return this.formatTokens(_value, precision, !!_shorten, (!!_token ? _token.decimals : undefined))
	},
	
	fullFormatTokens: function(_value, _token, _shorten)	
	{	
		if (_value === undefined)
		{
			_value = '0'
		}
		let precision = (!!_token && _token.decimals !== undefined ? _token.decimals : 18)
	
		return this.formatTokens(_value, precision, !!_shorten, (!!_token ? _token.decimals : undefined))
	},

	formatFiatDisplay(_value, _allowLongerVersion = false)
	{
		return this.smartFormatFiat(_value, window.chef.stableToken, true, _allowLongerVersion)
	},
	
	smartFormatFiat: function(_value, _token, _asCurrency = false, _allowLongerVersion = false)
	{
		if (_value === undefined)
		{
			_value = '0'
		}

		let result = this.formatTokens(_value, 2, false, (!!_token ? _token.decimals : undefined));
		if (_allowLongerVersion
			&& result < 1)
		{
			result = this.formatTokens(_value, 4, false, (!!_token ? _token.decimals : undefined));			
		}
		if (_asCurrency)
		{
			result = LLib.formatFiat(result);
		}

		return result;
	},
	
	smartFormatBigNumber: function(_value)
	{
		let posFP = _value.indexOf('.')
		let iPart = (posFP === -1 ? _value.length : posFP + 1)
		
		if (iPart >= 7)
		{
			//M + 2
			_value = _value.substr(0, iPart - 6) + '.' + _value.substr(iPart - 6, iPart - 4) + 'M'
		}
		else if (iPart >= 4)
		{
			//no fp	
			_value = _value.substring(0, iPart)
		}
		
		return _value
	},
	
	tokensToUint256String: function(_value)
	{		
		//fill up with 0, make 18 digits and remove .
		_value = _value.replace(',', '.')
		let o = _value.indexOf('.')
		_value = (o === -1 ? _value.padEnd(_value.length + 18, '0') : _value.padEnd(19 + o, '0'))
		_value = _value.replaceAll('.', '')
		_value = LLib.removeTrailStart(_value, '0');
		if (_value === '')
		{
			_value = '0';
		}		
		
		return _value;
	},

	formatAddress: function(_address)
	{
		if (!_address)
		{
			return ""
		}

		return _address.substring(0, 6) + ' ... ' + _address.substring(_address.length - 4)
	},
	//////////////////////////////////////////

	abiEncodeUint256: function(_bn)
	{
		let encoded = window.chef.web3_data.eth.abi.encodeParameter('uint256', _bn)
		if (encoded.length === 66
			|| encoded.length === 34)
		{
			encoded = encoded.substring(2)
		}
		return encoded
	},
	
	//////////////////////////////////////////
	//calls / sends
	
	tryCall: async function(_callPromise, _errorMsg, _default)
	{
		if (_callPromise === undefined
			&& _errorMsg !== undefined)
		{
			console.log(_errorMsg)
		}
		
		return await _callPromise.call().catch((e) =>
		{
			if (_errorMsg !== undefined)
			{
				console.log(_errorMsg)
			}
			if (_default !== undefined)
			{
				return _default
			}			
			throw e
		})
	},

	tryMultiCall: async function(_multiCall, _calls, _errorMsg, _topic, _default)
	{
		//performance debugging
		//console.log(`[MC] ${_topic} #${_calls.length}`)

		if (_multiCall === undefined
			&& _errorMsg !== undefined)
		{
			console.log(_errorMsg)
		}
		
		let ret = []
		try
		{
			ret = await _multiCall.all([_calls]).catch((e) =>
			{		
				throw e
			})
		}
		catch (e)
		{
			if (_errorMsg !== undefined)
			{
				console.log(_errorMsg)
			}
			if (_default !== undefined)
			{
				return _default
			}			
			throw e
		}

		//check for failed results
		for (let n = 0; n < ret.length; n++)
		{
			let retChild = ret[n]
			for (let m = 0; m < retChild.length; m++)
			{
				let retRes = retChild[m]
				for (const [, value] of Object.entries(retRes))
				{
					if (value === undefined)
					{
						if (_errorMsg !== undefined)
						{
							console.log(_errorMsg)
						}
						if (_default !== undefined)
						{
							return _default
						}			
						throw new Error("MultiCall failed")
					}
				}
			}
		}

		//return result
		return ret
	},
	
	trySend: async function(_callPromise, _from, _errorMsg, _default, _onTransactionHash, _onReceipt, _onConfirmation, _onError, _coinValue)
	{
		if (_callPromise === undefined
			&& _errorMsg !== undefined)
		{
			console.log(_errorMsg)
		}

		let data = 
		{
			from: _from
		}
		if (_coinValue !== undefined)
		{
			data.value = _coinValue
		}
		
		return await _callPromise.send(data)
			.once('transactionHash', (txHash) => { if (_onTransactionHash) _onTransactionHash(txHash) })
			.once('receipt', (receipt) => { if (_onReceipt) _onReceipt(receipt) })
			.once('confirmation', (confNumber, receipt) => { if (_onConfirmation) _onConfirmation(confNumber, receipt) })
			.on('error', (error) => { if (_onError) _onError(error) })
			.catch((e) =>
		{
			if (_errorMsg !== undefined)
			{
				console.log(_errorMsg)
			}
			if (_default !== undefined)
			{
				return _default
			}			
			throw e
		})
	},

	scanEvent: async function(_contract, _name, _fromBlock, _toBlock)
	{
		//defaulting
		if (_fromBlock === undefined)
		{
			_fromBlock = window.chef.currentBlock - 5000			
		}
		if (_toBlock === undefined)
		{
			_toBlock = 'latest'			
		}
		
		//get logs
		let result = null
		let options =
		{
			fromBlock: _fromBlock,
			toBlock: _toBlock
		}
		try
		{
			result = await _contract.getPastEvents(_name, options)	
		}
		catch(e) { }
		
		return result
	},

	//////////////////////////////////////////
	
	
	//////////////////////////////////////////
	//connection handling		
	web3Data:
	{
		connections: [ ],		
		multiCalls: [ ],
		web3RPCs: [ ]
	},
	
	initWeb3Data(_data)
	{
		this.web3Data = _data
	},

	createWeb3Connection: function(_id)
	{
		if (this.findWeb3Connection(_id) === null)
		{
			this.web3Data.connections.push(
			{
				id: _id,
				web3: null,
				currentRPC: '',
				chain: -1
			})			
		}		
	},
	
	createAndConnectWeb3Connection: async function(_id, _chain)
	{
		if (this.findWeb3Connection(_id) === null)
		{
			this.web3Data.connections.push(
			{
				id: _id,
				web3: null,
				currentRPC: '',
				chain: -1
			})
		}		
		return await this.connectWeb3(_id, _chain)	
	},
	
	findWeb3Connection: function(_id)
	{
		for (let n = 0; n < this.web3Data.connections.length; n++)
		{
			let c = this.web3Data.connections[n]
			if (c.id === _id)
			{
				return c
			}			
		}
		
		return null
	},
	
	findWeb3RPCs: function(_chain)
	{
		for (let n = 0; n < this.web3Data.web3RPCs.length; n++)
		{
			let c = this.web3Data.web3RPCs[n]
			if (c.chain === _chain)
			{
				return c.nodes
			}			
		}
		
		return []
	},

	findMultiCall: function(_chain)
	{
		for (let n = 0; n < this.web3Data.multiCalls.length; n++)
		{
			let c = this.web3Data.multiCalls[n];
			if (c.chain === _chain)
			{
				return c.multiCall;
			}			
		}
		
		return null;
	},

	closeProvider: async function()
	{
		if (Web3.currentProvider?.close)
		{
			await Web3.currentProvider.close();
		}
	},

	selectProvider: async function(_providerName)
	{
		//select provider
		if (_providerName === 'MetaMask')
		{
			Web3.currentProvider = new Web3(window.ethereum);
		}
		else if (_providerName === 'WalletConnect')
		{
			const rpc = {};
			this.web3Data.web3RPCs.forEach(c => rpc[c.chain] = c.nodes[0]);
			Web3.currentProvider = new WalletConnectProvider({ rpc: rpc });			
			await Web3.currentProvider.enable();
		}

		//reconnect all wallet based connections
		for (let n = 0; n < this.web3Data.web3RPCs.length; n++)
		{
			let c = this.web3Data.web3RPCs[n];
			if (c.currentRPC === '')
			{
				this.connectWeb3(c.id);
			}			
		}
	},

	disconnectWeb3: async function(_id)
	{
		let c = this.findWeb3Connection(_id)
		if (c === null)
		{
			return false
		}
	},
	
	connectWeb3: async function(_id, _chain)
	{
		if (_chain === undefined)
		{
			_chain = -1
		}
		
		let c = this.findWeb3Connection(_id)
		if (c === null)
		{
			return null
		}
		
		//make new web3
		if (_chain === -1)
		{
			if (Web3.currentProvider
				|| Web3.givenProvider)
			{
				c.web3 = new Web3(Web3.currentProvider || Web3.givenProvider)
				c.chain = await c.web3.eth.net.getId()
			}
		}
		else
		{
			let nodes = this.findWeb3RPCs(_chain)
			if (nodes.length === 0)
			{
				return null
			}
			
			c.currentRPC = nodes[0]
			c.web3 = new Web3(new Web3.providers.HttpProvider(c.currentRPC))			
			c.chain = await c.web3.eth.net.getId()
		}
		
		return c.web3
	},
	
	switchRPCWeb3: async function(_id)
	{
		//find connection
		let c = this.findWeb3Connection(_id)
		if (c === null)
		{
			return null
		}
		
		//find nodes
		let nodes = this.findWeb3RPCs(c.chain)
		if (nodes.length <= 1)
		{
			return null
		}
		
		//find current node
		let idx = nodes.indexOf(c.currentRPC)
		if (idx === -1)
		{
			return null
		}
		
		c.currentRPC = nodes[(idx + 1) % nodes.length]
		c.web3 = new Web3(new Web3.providers.HttpProvider(c.currentRPC))
		
		return c.web3
	},	

	makeMultiCall: function(_id)
	{
		//find connection
		let c = this.findWeb3Connection(_id)
		if (c === null)
		{
			return null
		}

		//find multicall
		let mc = this.findMultiCall(c.chain)
		if (mc === null)
		{
			return null
		}

		//make multicall
		const multicall = new MultiCall(c.web3, mc);

		return multicall
	},

	switchChain: async function(_chainID)
	{
		let c = null
		const rpcs = this.findWeb3RPCs(_chainID)
		if (rpcs.length === 0)
		{
			return
		}
		const rpc = rpcs[0]
		switch (_chainID)
		{
			case 25:
				c = 				
				{
					chainId: '0x'.concat(parseInt('25', 10).toString(16)),
					chainName: 'Cronos Mainnet',
					nativeCurrency:
					{
						name: 'Cronos Coin',
						symbol: 'CRO',
						decimals: 18,
					},
					rpcUrls: [rpc],
					blockExplorerUrls: ['https://cronoscan.com']
				}
				break

			case 56:
				c = 				
				{
					chainId: '0x'.concat(parseInt('56', 10).toString(16)),
					chainName: 'Binance Smart Chain Mainnet',
					nativeCurrency:
					{
						name: 'Binance Coin',
						symbol: 'BNB',
						decimals: 18,
					},
					rpcUrls: [rpc],
					blockExplorerUrls: ['https://bscscan.com']
				}
				break

			case 97:
				c = 				
				{
					chainId: '0x'.concat(parseInt('97', 10).toString(16)),
					chainName: 'Binance Smart Chain Testnet',
					nativeCurrency:
					{
						name: 'Binance Coin',
						symbol: 'BNB',
						decimals: 18,
					},
					rpcUrls: [rpc],
					blockExplorerUrls: ['https://testnet.bscscan.com']
				}
				break
				
			case 137:
				c = 				
				{
					chainId: '0x'.concat(parseInt('137', 10).toString(16)),
					chainName: 'Polygon Mainnet',
					nativeCurrency:
					{
						name: 'Polygon',
						symbol: 'MATIC',
						decimals: 18,
					},
					rpcUrls: [rpc],
					blockExplorerUrls: ['https://polygonscan.com']
				}
				break
				
			case 250:
				c = 				
				{
					chainId: '0x'.concat(parseInt('250', 10).toString(16)),
					chainName: 'Fantom Mainnet',
					nativeCurrency:
					{
						name: 'Fantom',
						symbol: 'FTM',
						decimals: 18,
					},
					rpcUrls: [rpc],
					blockExplorerUrls: ['https://ftmscan.com']
				}
				break

			case 1285:
				c = 				
				{
					chainId: '0x'.concat(parseInt('1285', 10).toString(16)),
					chainName: 'SolarBeam Mainnet',
					nativeCurrency:
					{
						name: 'Moonriver',
						symbol: 'MVR',
						decimals: 18,
					},
					rpcUrls: [rpc],
					blockExplorerUrls: ['https://moonriver.moonscan.io/']
				}
				break				
				
			case 1666600000:
				c = 				
				{
					chainId: '0x'.concat(parseInt('1666600000', 10).toString(16)),
					chainName: 'Harmony Mainnet',
					nativeCurrency:
					{
						name: 'Harmony',
						symbol: 'ONE',
						decimals: 18,
					},
					rpcUrls: [rpc],
					blockExplorerUrls: ['https://explorer.harmony.one']
				}
				break
				
			default:
				return
		}		
		
        await window.ethereum.request(
		{
			method: 'wallet_addEthereumChain',
			params:
			[
				c
			]
		})	
	}
	//////////////////////////////////////////	
}
//////////////////////////////////////////