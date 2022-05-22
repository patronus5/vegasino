//template & style
import Template_MoonVault from './components/Templates/Template_MoonVault';
import './styles/Style_Nevada.css';

//config
const config = 
{
	contract: {
		vegasStakingAddress: '0x19610F04e4Cc276044EF66222e270bC8D9Bf0007',
		nftStakingAddress  : '0xDaD6FA58C85D8c8D2FAE2AB156cbF0F893DEC62C',
		vegasTokenAddress  : '0x1610Daa4B2f74E5120C0c6dEc6c1eae33725D4ED',
		nftTokenAddress    : '0xCAD59546014762c0093Ad704d95e1fadBDEC7793'
	},
	//////////////////////////////////////////
	//page info
	page:
	{
		name: "VEGAS",
		defaultChain: 56,
		nativeToken: "0x7Aa653eAF70589722CBCa728802D05ceBc3583bF"
	},
	
	//////////////////////////////////////////
	//settings
	settings:
	{
		alwaysUseUserWeb3: true
	},

	//////////////////////////////////////////
	//template info
	template:
	{
		useMenuGlow: false,
		showNativePrice: true
	},

    //////////////////////////////////////////
	//web 3 connections
    web3Data:
	{
		connections: [ ],		
		multiCalls:
		[
			{
				chain: 56,
				multiCall: '0xB94858b0bB5437498F5453A16039337e5Fdc269C'	
			}
		],
		web3RPCs:
		[
			{
				chain: 56,
				multiCall: '0xB94858b0bB5437498F5453A16039337e5Fdc269C',
				nodes:
				[
					'https://bsc-dataseed.binance.org/',
					'https://bsc-dataseed1.defibit.io/',
					'https://bsc-dataseed1.ninicoin.io/'
				]			
			}
		]
	}
    //////////////////////////////////////////
}

//export
export
{
	config,

	Template_MoonVault as Template	
}