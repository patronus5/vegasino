import React from 'react'
import VegasStaking from '../../../../../classes/VegasStaking'
import NFTStaking from '../../../../../classes/NFTStaking'
import { config } from '../../../../../config'
import './StakingPool.css'

let init = false

class StakingPool extends React.Component {

    constructor(props) {
        super(props)
        
        this.refVegasModalManager = props.refVegasModalManager
        this.nftStaking = new NFTStaking(config.contract.nftStakingAddress, config.contract.nftTokenAddress)
        this.vegasStaking = new VegasStaking(config.contract.vegasStakingAddress, config.contract.vegasTokenAddress)
        this.state = {
            token: {
                roi: 0,
                apr: 0,
                tvl: 0,
                balance: 0,
                staked_balance: 0
            },
            nft: {
                roi: 0,
                apr: 0,
                tvl: 0,
                balance: 0,
                statked_balance: 0
            }
        }
    }

    updateStatus = async () => {
        let data = await this.vegasStaking.getInfo()
        if(data === null) return

        this.setState({
            ...this.state,
            token: {
                ...data
            }
        })
    }

// for vegasino staking
    emitStakeForToken () {
        if(!this.vegasStaking.approved) {
            this.refVegasModalManager.current.showVegasinoDialog("approve", this.vegasStaking, false)
            return
        }
        this.refVegasModalManager.current.showVegasinoDialog("deposit", this.vegasStaking, false)
    }

    emitUnstakeForToken () {
        this.refVegasModalManager.current.showVegasinoDialog('withdraw', this.vegasStaking, false)
    }

    emitUnstakeAllForToken () {
        this.vegasStaking.unstakeAll()
    }

    emitClaimForToken () {
        this.vegasStaking.claim()
    }

    emitCompoundForToken () {
        this.vegasStaking.compound()
    }

// for nft staking    
    emitStakeForNFT () {
        if(!this.nftStaking.approved) {
            this.refVegasModalManager.current.showVegasinoDialog("approve", this.nftStaking, true)
            return
        }
        this.refVegasModalManager.current.showVegasinoDialog("deposit", this.nftStaking, true)
    }

    emitStakeAllForNFT () {
        this.nftStaking.statkeAll()
    }

    emitUnstakeForNFT () {
        this.refVegasModalManager.current.showVegasinoDialog('withdraw', this.nftStaking, true)
    }

    emitUnstakeAllForNFT () {
        this.nftStaking.unstakeAll()
    }

    componentDidMount() {
        if(!init) {
            this.updateStatus()
            init = true
        }
        this.timeId = setInterval(this.updateStatus(), 30000)
    }

    componentWillUnmount() {
        clearInterval(this.timeId)
    }

    render() {
        return (
            <div className='card-group relative'>
                <div className='card-group absolute z-0'>
                    <div className='frame flex-col justify-center'>
                        <img className='w-full' src="./token_background.png" alt="token_image" />
                    </div>
                    <div className='frame flex-col justify-center'>
                        <img className='w-full' src="./nft_background.png" alt="token_image" />
                    </div>
                </div>
                <div className='card-group z-10'>
                    <div className='flex-col justify-between card'>
                        <div className='flex-col'>
                            <h1 className='title'>Vegas</h1>
                            <div className='flex-row justify-between'>
                                <h1>APY: </h1>
                                <h1>{33}%</h1>
                            </div>
                            <div className='flex-row justify-between'>
                                <h1>APR: </h1>
                                <h1>{this.state.token.apr}%</h1>
                            </div>
                            <div className='flex-row justify-between'>
                                <h1>TVL: </h1>
                                <h1>{this.state.token.tvl}</h1>
                            </div>
                            <div className='flex-row justify-between'>
                                <h1>Your balance: </h1>
                                <h1>{this.state.token.balance}</h1>
                            </div>
                            <div className='flex-row justify-between'>
                                <h1>Staked Amount: </h1>
                                <h1>{this.state.token.staked_balance}</h1>
                            </div>
                        </div>

                        <div className='flex-col w-full place-items-center space-y-3'>
                            <div className='flex-row w-full justify-evenly'>
                                <button className='w-40' onClick={() => this.emitStakeForToken()}>Stake</button>
                                <button className='w-40' onClick={() => this.emitClaimForToken()}>Claim</button>
                            </div>
                            <div className='flex-row w-full justify-evenly'>
                                <button className='w-40' onClick={() => this.emitUnstakeForToken()}>Unstake</button>
                                <button className='w-40' onClick={() => this.emitUnstakeAllForToken()}>Unstake All</button>
                            </div>
                            <div className='w-80'>
                                <button className='w-full' onClick={() => this.emitCompoundForToken()}>Compound</button>
                            </div>
                        </div>
                    </div>

                    <div className='flex-col justify-between card'>
                        <div className='flex-col'>
                            <h1 className='title'>NFT</h1>
                            <div className='flex-row justify-between'>
                                <h1>APY: </h1>
                                <h1>{300}%</h1>
                            </div>
                            <div className='flex-row justify-between'>
                                <h1>APR: </h1>
                                <h1>{this.state.nft.apr}%</h1>
                            </div>
                            <div className='flex-row justify-between'>
                                <h1>TVL: </h1>
                                <h1>{this.state.nft.tvl}</h1>
                            </div>
                            <div className='flex-row justify-between'>
                                <h1>Available NFT: </h1>
                                <h1>{this.state.nft.balance}</h1>
                            </div>
                            <div className='flex-row justify-between'>
                                <h1>Staked NFT: </h1>
                                <h1>{this.state.nft.statked_balance}</h1>
                            </div>
                        </div>

                        <div className='flex-col w-full place-items-center space-y-3'>
                            <div className='flex-row w-full justify-evenly'>
                                <button className='w-40' onClick={() => this.emitStakeForNFT()}>Stake</button>
                                <button className='w-40' onClick={() => this.emitStakeAllForNFT()}>Stake All</button>
                            </div>
                            <div className='flex-row w-full justify-evenly'>
                                <button className='w-40' onClick={() => this.emitUnstakeForNFT()}>Unstake</button>
                                <button className='w-40' onClick={() => this.emitUnstakeAllForNFT()}>Unstake All</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default StakingPool