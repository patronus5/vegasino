import React from 'react';
import Modal from '../../Modal'
import { Text, Group, Button } from '../../../Controls'

class ModalVegasinoApprove extends React.Component
{
	constructor(props) {   
		super(props)
		
		this.state = {
            vegasinoPool: props.vegasinoPool || null,
            onClose: props.onClose || null
		}
	}

    close() {
        if (!!this.state.onClose){
            this.state.onClose()
        }
    }

    async onClick_approve() {   
        this.close()    
        await this.state.vegasinoPool.approve()        
    }
    
	render() {
		let header = <Text size="1">Approve {this.state.vegasinoPool.depositToken?.symbol}</Text>
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
                        To interact with this pool, you must allow the pool to access your {this.state.vegasinoPool.depositToken?.symbol} tokens.
                    </Text>
				</Group>
			</Modal>
		)
	}
}

export default ModalVegasinoApprove;