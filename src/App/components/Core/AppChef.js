//libs
import { LLib, LWeb3 } from '../../libs/'

//classes
import MasterChef from '../../classes/MasterChef'
import Farm from '../../classes/Farm'
import Cashier from '../../classes/Cashier'
import Presale from '../../classes/Presale'
import NFT from '../../classes/NFT'
import Migrator from '../../classes/Migrator'

//components
import AppChef_base from './AppChef_base'

class AppChef extends AppChef_base
{
	constructor(props)
	{   
		super(props)

        //classes
        this.masterChef = null;
        this.farms = [];
        this.cashier = null;
        this.presale = null;
        this.migrator = null;
        this.nft = null;
        this.additionalPresales = [];
	}

    async refreshChainData()
    { 
        //base
        await super.refreshChainData() 

        //farms
        await this.refreshData_farms()

        //migrator
        await this.migrator.reloadUser();

        //cashier
        if (this.cashier !== null)
        {
            await this.cashier.reloadInfo()
        }

        //presale
        if (this.presale !== null)
        {
            await this.presale.reloadInfo();        
            if (this.account !== null)
            {
                await this.presale.reloadUserData();
            }
        }

        //nfts
        try
        {
            if (this.nft !== null)
            {
                if (this.account !== null)
                {
                    await this.nft.reloadUserData();
                    await this.nft.batchLoadUserNFTs(0, this.nft.userBalance);
                }
                await this.nft.reloadInfo();            
                await this.nft.batchLoadNFTs(0, this.nft.totalSupply);
                await this.nft.batchLoadNFTURI();            
            }
        }
        catch (e) { } 

        //addtional presales
        for (let n = 0; n < this.additionalPresales.length; n++)
        {
            await this.additionalPresales[n].reloadInfo();        
            if (this.account !== null)
            {
                await this.additionalPresales[n].reloadUserData();
            }            
        }
    }

    async refreshData_farms()
    {
        //init
        let tvl = "0"
        let minAPR = 0
        let maxAPR = 0
        let totalDepositUSD = window.chef.toBN(0)
        let totalPendingUSD = window.chef.toBN(0)
        let userDepositUSD = window.chef.toBN(0)
        let userPendingUSD = window.chef.toBN(0)
		let roiDailyAPR = 0
		let roiWeeklyAPR = 0
		let roiMonthlyAPR = 0
		let roiYearlyAPR = 0
		let roiDailyAPY = 0
		let roiWeeklyAPY = 0
		let roiMonthlyAPY = 0
		let roiYearlyAPY = 0

        //handle vaults
        for (let n = 0; n < this.farms.length; n++)
        {
            let v = this.farms[n]
            await v.reloadFarmInfo()            
            if (this.account !== null)
            {
                await v.reloadUserInfo()
            }

            //process
            maxAPR = Math.max(maxAPR, v.dailyAPR)
            minAPR = (minAPR === 0 ? v.dailyAPR : Math.min(minAPR, v.dailyAPR))
            totalDepositUSD = totalDepositUSD.add(window.chef.toBN(v.totalDepositUSD))
            totalPendingUSD = totalPendingUSD.add(window.chef.toBN(v.totalPendingUSD))
            userDepositUSD = userDepositUSD.add(window.chef.toBN(v.userDepositUSD))
            userPendingUSD = userPendingUSD.add(window.chef.toBN(v.userPendingUSD))
            roiDailyAPR += v.roiDailyAPR
            roiWeeklyAPR += v.roiWeeklyAPR
            roiMonthlyAPR += v.roiMonthlyAPR
            roiYearlyAPR += v.roiYearlyAPR
            roiDailyAPY += v.roiDailyAPY
            roiWeeklyAPY += v.roiWeeklyAPY
            roiMonthlyAPY += v.roiMonthlyAPY
            roiYearlyAPY += v.roiYearlyAPY
        }

        //set values
        this.currentTVL = tvl
        this.maxAPR = maxAPR
        this.minAPR = minAPR
        this.totalDepositUSD = totalDepositUSD.toString(10)
        this.totalPendingUSD = totalPendingUSD.toString(10)
        this.userDepositUSD = userDepositUSD.toString(10)
        this.userPendingUSD = userPendingUSD.toString(10)
        this.roiDailyAPR = roiDailyAPR
		this.roiWeeklyAPR = roiWeeklyAPR
		this.roiMonthlyAPR = roiMonthlyAPR
		this.roiYearlyAPR = roiYearlyAPR
		this.roiDailyAPY = roiDailyAPY
		this.roiWeeklyAPY = roiWeeklyAPY
		this.roiMonthlyAPY = roiMonthlyAPY
		this.roiYearlyAPY = roiYearlyAPY

        const uDeposit = parseFloat(LWeb3.fullFormatTokens(this.userDepositUSD, this.stableToken))
        this.avgDailyAPR = this.roiDailyAPR / (uDeposit === 0 ? 1 : uDeposit)
        this.avgYearlyAPR = this.roiYearlyAPR / (uDeposit === 0 ? 1 : uDeposit)
        this.avgYearlyAPY = this.roiYearlyAPY / (uDeposit === 0 ? 1 : uDeposit)
    }

    async initChainData()
    {
        //init master chef
        this.masterChef = new MasterChef(this.currentChain.masterChef)        
        await this.masterChef.init()

        //base
        await super.initChainData()

        //init farms
        const jsonFarms = await LLib.fetchJSON('./data/' + this.currentChain.name + '/farms.json')
        for (let n = 0; n < jsonFarms.length; n++)
        {
            let f = jsonFarms[n]
            let farm = new Farm(f)
            this.farms.push(farm)
        }

        //init cashier
        this.cashier = new Cashier(this.currentChain.cashier);

        //migrator
        this.migrator = new Migrator(this.currentChain.migrator);
        try
        {
            await this.migrator.init();
        }
        catch (e) { }

        //presale
        this.presale = new Presale(this.currentChain.presale);
        try
        {
            await this.presale.init();
        }
        catch (e) { }

        //nft
        this.nft = new NFT(this.currentChain.nft);
        try
        {
            await this.nft.init();
        }
        catch (e) { }

        //additional presales
        for (let n = 0; n < this.currentChain.additionalSales.length; n++)
        {
            const pi = this.currentChain.additionalSales[n];
            const ps = new Presale(pi.contract, pi.id);
            this.additionalPresales.push(ps);
            try
            {
                await ps.init();
            }
            catch (e) { }
        }
    }
	
	findFarm(_id)
	{
        let farm = this.farms.find((f) => f.id === _id)
        return (farm || null)
	}

    findPresale(_id)
    {
        if (_id === "")
        {
            return this.presale;
        }
        const ret = this.additionalPresales.find(p => p.id === _id);
        return ret || null;
    }
}

export default AppChef;