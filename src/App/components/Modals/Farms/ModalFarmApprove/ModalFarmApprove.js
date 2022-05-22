import React from 'react';

//components
import Modal from '../../Modal'
import { Text, Group, Button } from '../../../Controls'

class ModalFarmApprove extends React.Component
{
	constructor(props)
	{   
		super(props)
		
		//init state
		this.state = 
		{
            farm: props.farm || null,
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
        this.close()    
        await this.state.farm.approve()        
    }
    
	render()
	{
		let header = <Text size="1">Approve {this.state.farm.depositToken?.symbol}</Text>
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
				className="ModalFarmApprove sizeNormal"
                onClose={() => this.close()}
				header={header}
				footer={footer}>
				<Group className="content">
                    <Text color="2">
                        To interact with this Farm, you must allow the farm to access your {this.state.farm.depositToken?.symbol} tokens.
                    </Text>
				</Group>
			</Modal>
		)
	}
}

export default ModalFarmApprove;