import React from 'react';

//components
import Button from '../Button/Button';

//modals
import ModalSelectChain from '../../../Modals/ModalSelectChain/ModalSelectChain'

//css
import './ButtonSelectChain.css'

class ButtonSelectChain extends React.Component
{
	constructor(props)
	{   
		super(props)

		//init state
		this.state = 
		{
			selectedChain: 'NONE'
		}

		this.refreshCurrentChain = this.refreshCurrentChain.bind(this)
	}

	componentDidMount()
	{	
		this.refreshCurrentChain()
		document.addEventListener('chef_dataLoaded', this.refreshCurrentChain)
	}

	componentWillUnmount()
	{
		document.removeEventListener('chef_dataLoaded', this.refreshCurrentChain)
	}

	refreshCurrentChain()
	{
		const selectedChain = (window.chef === undefined || window.chef.currentChain === null ? 'Select Chain' : window.chef.currentChain.name)
		this.setState({ selectedChain })
	}

	onClick_button()
	{
		ModalSelectChain.showModal_SelectChain()
	}
	
	render()
	{
		return (			
			<Button
				className={'ButtonSelectChain chain_' + this.state.selectedChain}
				onClick={() => this.onClick_button()}>
				{this.state.selectedChain}
			</Button>
		)
	}
}

export default ButtonSelectChain;