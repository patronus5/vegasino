import React from 'react';

//libs
import { LWeb3, LLib } from '../../../libs/'

//components
import Modal from '../Modal'
import { Text, Button, Group } from '../../Controls'

//css
import './ModalSelectChain.css'

//vars
var modal_SelectChain = null

class ModalSelectChain extends React.Component
{
	constructor(props)
	{   
		super(props)
		
		//init state
		this.state = 
		{
            show: props.show || false				
		}

		//vars
		modal_SelectChain = this
	}

	static showModal_SelectChain()
	{
		modal_SelectChain.setShow(true)
	}

	setShow(_show)
	{
		this.setState(
		{
			show: _show
		})
	}

	async onClick_selectChain(_chainID)
	{
		LLib.setStorage(false, 'web3_selectedChain', _chainID);
		if (window.chef.walletInstalled)
		{
			await LWeb3.switchChain(_chainID)
		}
		else
		{
			window.location.reload();
		}
		this.setShow(false)
	}

	renderChainButtons()
	{
		if (window.chef === undefined)
		{
			return null
		}

		let sortedChains = [];
		window.chef.chains.forEach(c =>
		{
			sortedChains.push(
			{
				id: c.id,
				name: c.name
			});
		});
		sortedChains.sort((a, b) => (a.name > b.name ? 1 : (a.name < b.name ? -1 : 0)));

		const listChains = sortedChains.map((chain) =>
		{
			let c = window.chef.findChain(chain.id)
			if (c === null)
			{
				return null
			}
			
			return (			
				<React.Fragment key={c.id}>
					<Button
						className={"ChainButton chain_" + c.name}
						onClick={() => this.onClick_selectChain(chain.id)}>
						{c.name}
					</Button>
				</React.Fragment>
			)
		})		
		
		return listChains
	}

	render()
	{
		let header = <Text size="1">Select Chain:</Text>
		let footer = <Button className="ModalButton" onClick={() => this.setShow(false)}>cancel</Button>

		return (
			<Modal
				show={this.state.show}
				className="ModalSelectChain sizeNormal"
				onClose={() => this.setShow(false)}
				header={header}
				footer={footer}>
				<Group className="ChainButtons">
					{this.renderChainButtons()}
				</Group>
			</Modal>
		)
	}
}

export default ModalSelectChain;