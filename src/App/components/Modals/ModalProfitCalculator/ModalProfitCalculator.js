import React from 'react';

//components
import Modal from '../Modal'
import { Button, Text, Group, ProfitCalculator } from '../../Controls'

//css
import './ModalProfitCalculator.css'

class ModalProfitCalculator extends React.Component
{
	constructor(props)
	{   
		super(props)
		
		this.vault = props.vault;
		this.onClose = props.onClose;
	}

	close()
	{
		if (!!this.onClose)
        {
            this.onClose()
        }
	}

	render()
	{
		let header = <Text size="1">Profit Calculator</Text>
		let footer = (
            <>
				<Button className="ModalButton" onClick={() => this.reset()}>
                    reset
                </Button>
                <Button className="ModalButton" onClick={() => this.close()}>
                    close
                </Button>
            </>
        )

		return (
			<Modal
				show={this.props.show}
				className="ModalProfitCalculator sizeNormal"
				onClose={() => this.close()}
				header={header}
				footer={footer}>
				<Group className="content">
					<ProfitCalculator version="1" vault={this.vault} showReset={false} reset={r => this.reset = r} />
				</Group>
			</Modal>
		)
	}
}

export default ModalProfitCalculator;