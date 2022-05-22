import React from 'react';

//components
import Modal from '../Modal'
import { Text, Group, Button } from '../../Controls'

//css
//import './ModalSelectChain.css'


class ModalMoonApprove extends React.Component
{
	constructor(props)
	{   
		super(props)
		
		//init state
		this.state = 
		{
            onClose: props.onClose || null
		}
	}

    close()
    {
        if (!!this.state.onClose)
        {
            this.state.onClose()
        }
    }

    async onClick_approve()
    {       
        const token = (this.props.moonToken === "true" ? window.chef.moonChef.moonToken : window.chef.moonChef.peggedToken)
        this.close()
        await token.approve(window.chef.moonChef.address)        
    }
    
	render()
	{
        const token = (this.props.moonToken === "true" ? window.chef.moonChef.moonToken : window.chef.moonChef.peggedToken)
		let header = <Text size="1">Approve {token.symbol}</Text>
		let footer = (
            <>
                <Button
                    className="ModalButton"
                    buttonStyle="1"
                    onClick={() => this.onClick_approve()}>
                    approve
                </Button>
            </>
        )

		return (
			<Modal
				show={this.props.show}
				className="ModalMoonApprove sizeNormal"
                onClose={() => this.close()}
				header={header}
				footer={footer}>
				<Group className="content">
                    <Text color="2">
                        To interact with this contract, you must allow the contract to access your {token.symbol} tokens.
                    </Text>
				</Group>
			</Modal>
		)
	}
}

export default ModalMoonApprove;