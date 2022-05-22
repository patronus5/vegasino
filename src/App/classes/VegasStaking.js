import { LWeb3 } from '../libs/LWeb3'
import { config } from '../config'
import { ABI_IToken } from '../contracts/IToken'
import { ABI_VegasStaking } from '../contracts/VegasStaking'

const maxVal = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"

class VegasStaking {

    constructor(address, tokenAddress) {
        this.approved = false
        this.address = address
        this.tokenAddress = tokenAddress
        this.depositToken = {
            symbol: 'Vegasino'
        }
    }

    debugErrorString(_text) {
		return 'Transaction failed at: ' + _text		
	}

    getContract() {
        let web3 = LWeb3.findWeb3Connection('user')?.web3
        if(web3 === null || web3 === undefined) {
            return null
        }
        let con = new web3.eth.Contract(ABI_VegasStaking, this.address)
        return con
    }

    getTokenContract() {
        let web3 = LWeb3.findWeb3Connection('user')?.web3
        if(web3 === null || web3 === undefined) {
            return null
        }
        let con = new web3.eth.Contract(ABI_IToken, this.tokenAddress)
        return con
    }

    async approve() {
        let token = this.getTokenContract()
        if(token === null) {
            return
        }
        await window.chef.trySend(
            token.methods.approve(this.address, maxVal),
            window.chef.account,
            this.debugErrorString("approve"),
            undefined
        ).then(() => {
            this.approved = true
        })
    }

    async balanceOf() {
        let token = this.getTokenContract()
        if(token === null) {
            return
        }
        let balance = await token.methods.balanceOf(window.chef.account).call()
        return balance
    }

    async getInfo() {
        let contract = this.getContract()
        if(contract === null) {
            return null
        }
        let apr = await contract.methods.APR().call()
        let tvl = await contract.methods.TotalShares().call()
        let staked_balance = await contract.methods.stakedTokens(window.chef.account).call()
        let roi = 0
        let balance = await this.balanceOf()

        return {
            roi,
            apr,
            tvl,
            balance,
            staked_balance
        }
    }

    async claim() {
        let contract = this.getContract()
        if(contract === null) {
            return
        }
        await window.chef.trySend(
            contract.methods.WithdrawDividents(),
            window.chef.account,
            this.debugErrorString("claim"),
            undefined
        )
    }

    async compound() {
        let contract = this.getContract()
        if(contract === null) {
            return
        }
        await window.chef.trySend(
            contract.methods.Compound(),
            window.chef.account,
            this.debugErrorString("compound"),
            undefined
        )
    }

    async statke(amount) {
        let contract = this.getContract()
        if(contract === null) {
            return
        }
        await window.chef.trySend(
            contract.methods.Deposit(amount),
            window.chef.account,
            this.debugErrorString("deposit"),
            undefined
        )
    }

    async unstake(amount) {
        let contract = this.getContract()
        if(contract === null) {
            return
        }
        await window.chef.trySend(
            contract.methods.WithdrawDeposit(amount),
            window.chef.account,
            this.debugErrorString("withdraw"),
            undefined
        )
    }

    async unstakeAll() {
        let contract = this.getContract()
        if(contract === null) {
            return
        }
        await window.chef.trySend(
            contract.methods.WithdrawAll(),
            window.chef.account,
            this.debugErrorString("withdrawAll"),
            undefined
        )
    }
}

export default VegasStaking