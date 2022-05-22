import React from 'react';

//libs
import {LLib} from '../../../../../libs/LLib'
import {LWeb3} from '../../../../../libs/LWeb3'

//components
import { Button, Group, Text, } from '../../..'
import { FarmHeader } from '../../'

//css
import './FarmView.css'

class FarmView extends React.Component
{
	constructor(props)
	{   
		super(props)

        //init state
		this.state = 
		{
            updateRevision: 0
		}
		
		//init
		this.id = props.id
        this.refFarmModalManager = props.refFarmModalManager
        this.farm = window.chef.findFarm(this.id)
        this.icon1 = ""
        this.icon2 = ""
        this.initIcons()

        this.checkUpdate_token = this.checkUpdate_token.bind(this)
        this.checkUpdate_farm = this.checkUpdate_farm.bind(this)
	}

    componentDidMount()
	{	
        this.init()        

        document.addEventListener('token_userInfo', this.checkUpdate_token)
        document.addEventListener('token_priceInfo', this.checkUpdate_token)
        document.addEventListener('farm_farmInfo', this.checkUpdate_farm)
        document.addEventListener('farm_userInfo', this.checkUpdate_farm);  
	}

    componentWillUnmount()
	{	
        document.removeEventListener('token_userInfo', this.checkUpdate_token)
        document.removeEventListener('token_priceInfo', this.checkUpdate_token)
        document.removeEventListener('farm_farmInfo', this.checkUpdate_farm)
        document.removeEventListener('farm_userInfo', this.checkUpdate_farm)
	}

    updateView()
	{
		this.setState({ updateRevision: this.state.updateRevision + 1 })
	}

    checkUpdate_token(_data)
    {
        if (this.farm.depositToken.address === _data.detail.address
            || this.farm.rewardToken.address === _data.detail.address)
        {
            this.updateView()
        }
    }

    checkUpdate_farm(_data)
    {
        if (this.farm.address === _data.detail.address)
        {
            this.updateView()
        }
    }

    async init()
    {
        await this.farm.init()        
        this.updateView()        
        this.reloadData()        
    }

    async onClick_claim()
    {
        await this.farm.claim()
    }

    async onClick_deposit()
    {
        if (!this.farm.initializedUser
            || !this.farm.isApproved)
        {
            this.refFarmModalManager.current.showFarmDialog("approve", this.farm)
            return
        }

        this.refFarmModalManager.current.showFarmDialog("deposit", this.farm)
    }

    async onClick_withdraw()
    {
        this.refFarmModalManager.current.showFarmDialog("withdraw", this.farm)
    }    

    onClick_showCalculator(_farm)
    {
        this.refFarmModalManager.current.showFarmDialog("calculator", this.farm)
    }

    async reloadData()
    {
        //farm info
        try
        {
            await this.farm.reloadFarmInfo()
            await this.farm.reloadDBInfo()
        }
        catch { }

        //user info
        if (window.chef.account !== null)
        {
            try
            {
                await this.farm.reloadUserInfo()
            }
            catch { }
        }

        //update
        this.updateView()
    }

    initIcons()
    {
        //find icons	
        if (this.farm.icon !== null
            && this.farm.icon !== "")
        {
            this.icon1 = this.farm.icon
        }
        else
        {
            //check for alternative
            if (this.farm.depositToken !== null
                && !!this.farm.depositToken.icon)
            {
                this.icon1 = this.farm.depositToken.icon
            }
            if (this.farm.depositToken?.token0 !== null
                && this.icon1 === "")
            {
                let token1 = window.chef.findToken(this.farm.depositToken.token0)
                this.icon1 = token1.icon
            }
            if (this.farm.depositToken?.token1 !== null
                && this.icon2 === "")
            {
                let token2 = window.chef.findToken(this.farm.depositToken.token1)
                this.icon2 = token2.icon				
            }
        }
    }

    renderNameValueGroup(_id, _name, _value, _disabledColor, _value2, _icon)
    {
        let content = (
            <Text color={!!_disabledColor ? "0" : "2"}>
                {_value}
            </Text>
        )

        return this.renderNameContentGroup(_id, _name, content, _value2, _icon)
    }

    renderNameContentGroup(_id, _name, _content, _content2, _icon)
    {
        //content 2
        let c2 = null
        if (_content2 !== undefined)
        {
            c2 = (
                <Group className="groupValue2">
                    {_content2}
                </Group>
            )
        }

        //content group
        return (
            <Group className={"FarmInfoGroup " + _id}>
                <Group className="groupName">
                    <Text color="1">
                        {_name}
                        {_icon ?? <></>}
                    </Text>
                </Group>
                <Group className="groupValue">
                    {_content}
                </Group>
                {c2}
            </Group>
        )
    }

    renderDepositWithdraw()
    {
        //get token balance
        let depositTokenBalance = this.farm.depositToken?.userBalance || "0"        
        let userDeposit = this.farm.userDeposit || "0"   

        //deposit
        let deposit = (
            <Button
                buttonStyle={depositTokenBalance === "0" ? "0" : "1"}
                onClick={() => this.onClick_deposit()}>
                Deposit
            </Button>
        )

        //withdraw
        let withdraw = (
            <Button
                buttonStyle={userDeposit === "0" ? "0" : "1"}
                onClick={() => this.onClick_withdraw()}>
                Withdraw
            </Button>
        )

        return (
            <Group className="depositWithdraw">
                {deposit}
                {withdraw}
            </Group>
        )
    }
    
    renderTotalDeposit()
    {
        return this.renderNameValueGroup(
            "ttl",
            "TTL",
            LLib.renderLoading(
                this.farm.initializedInfo, 
                LWeb3.smartFormatTokens(
                    this.farm.totalDeposit, 
                    this.farm.depositToken, 
                    true)),
            this.farm.initializedInfo && this.farm.totalDeposit === "0")
    }

    renderTotalDepositUSD()
    {
        return this.renderNameValueGroup(
            "tvl",
            "TVL",
            LLib.renderLoading(
                this.farm.initializedInfo && this.farm.depositToken.initializedPrice, 
                LWeb3.formatFiatDisplay(this.farm.totalDepositUSD)),
            this.farm.initializedInfo && this.farm.totalDeposit === "0")
    }

    renderTotalPending()
    {
        return this.renderNameValueGroup(
            "totalPending",
            "total pending",
            LLib.renderLoading(
                this.farm.initializedInfo, 
                LWeb3.smartFormatTokens(
                    this.farm.totalPending, 
                    this.farm.rewardToken, 
                    true)),                    
            this.farm.initializedInfo && this.farm.totalPending === "0")
    }

    renderUserDeposit()
    {
        //user deposit
        return this.renderNameValueGroup(
            "userDeposit",
            "deposit",
            LLib.renderLoading(
                this.farm.initializedUser,
                LWeb3.smartFormatTokens(
                    this.farm.userDeposit, 
                    this.farm.depositToken, 
                    true)),
            this.farm.initializedUser && this.farm.userDeposit === "0")
    }

    renderUserPending()
    {
        return this.renderNameValueGroup(
            "userPending",
            "pending",
            LLib.renderLoading(
                this.farm.initializedUser, 
                LWeb3.smartFormatTokens(
                    this.farm.userPending, 
                    this.farm.rewardToken, 
                    true)),
            this.farm.initializedUser && this.farm.userPending === "0")
    }

    renderFarmInfo()
    {
        return (
            <FarmHeader farm={this.farm} showContract={false} showDetailsLink={false} />
        )
    }

    renderDailyROI()
    {
        return this.renderNameValueGroup(
            "dailyROI",
            "daily ROI",
            LLib.renderLoading(
                this.farm.initializedInfo && this.farm.depositToken.initializedPrice && this.farm.rewardToken.initializedPrice, 
                LLib.smartFormatPercent(
                    this.farm.dailyAPR * 100, 
                    true)),
            this.farm.initializedInfo && this.farm.dailyAPR === 0,
            LLib.renderLoading(
                this.farm.initializedInfo, 
                <Text size="-1" color="0">{LLib.smartFormatPercent(this.farm.compoundedAPY * 100, true)} APY</Text>))
    }

    renderClaim()
    {
        const fiat = parseFloat(LWeb3.smartFormatFiat(this.farm.userPendingUSD, window.chef.stableToken))
        return (
            <Group className="claim">
                <Button buttonStyle={fiat > 0 ? 1 : 0} onClick={() => this.onClick_claim()}>
                    Claim
                    <br />
                    ~ {LWeb3.formatFiatDisplay(this.farm.userPendingUSD)}
                </Button>
            </Group>
        )
    }


    render()
    {
        let cn = "FarmView " + (this.props.className || "")

        return (
			<Group className={cn}>

                {this.renderFarmInfo()}

                {this.renderDailyROI()}

                {this.renderTotalDepositUSD()}
                
                {this.renderUserDeposit()}

                {this.renderDepositWithdraw()}

                {this.renderClaim()}

			</Group>
		)
    }
}

export default FarmView;