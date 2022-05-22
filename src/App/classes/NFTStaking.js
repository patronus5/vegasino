import { LWeb3 } from '../libs/LWeb3'
import { ABI_NFT } from '../contracts/NFT'
import { ABI_NFTStaking } from '../contracts/NFTStaking'

class NFTStaking {

    constructor(address, tokenAddress) {
        this.approved = false
        this.address = address
        this.tokenAddress = tokenAddress
        this.depositToken = {
            symbol: 'NFT'
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
        let con = new web3.eth.Contract(ABI_NFTStaking, this.address)
        return con
    }

    getTokenContract() {
        let web3 = LWeb3.findWeb3Connection('user')?.web3
        if(web3 === null || web3 === undefined) {
            return null
        }
        let con = new web3.eth.Contract(ABI_NFT, this.tokenAddress)
        return con
    }

    async approve() {
        let token = this.getTokenContract()
        if(token === null) {
            return
        }
        await window.chef.trySend(
            token.methods.setApprovalForAll(this.address, true),
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
        let staked_balance = await contract.methods.stakedValue(window.chef.account).call()
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

    async statke(id) {
        let contract = this.getContract()
        if(contract === null) {
            return
        }
        await window.chef.trySend(
            contract.methods.Deposit(id),
            window.chef.account,
            this.debugErrorString("stake"),
            undefined
        )
    }

    async statkeAll() {
        let contract = this.getContract()
        if(contract === null) {
            return
        }
        await window.chef.trySend(
            contract.methods.DepositAll(),
            window.chef.account,
            this.debugErrorString("stakeAll"),
            undefined
        )
    }

    async unstake(id) {
        let contract = this.getContract()
        if(contract === null) {
            return
        }
        await window.chef.trySend(
            contract.methods.WithdrawNFT(id),
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

export default NFTStaking