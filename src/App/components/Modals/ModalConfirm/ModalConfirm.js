import React from 'react';

//components
import Modal from '../Modal'
import { Text, Button } from '../../Controls'

//vars
var modal_confirm = null

class ModalConfirm extends React.Component
{
    constructor(props)
	{   
		super(props)
		
		//init state
		this.state = 
		{
            show: props.show || false,
            title: "",
            text: "",
            onConfirm: null		
		}

		//vars
		modal_confirm = this
	}

	static showModal_Confirm(_title, _text, _onConfirm)
	{
		modal_confirm.setShow(true)
        modal_confirm.setState(
        {
            title: _title,
            text: _text,
            onConfirm: _onConfirm
        })
	}

	setShow(_show)
	{
		this.setState(
		{
			show: _show
		})
	}

	async onClick_confirm()
	{
        this.setShow(false)
        if (this.state.onConfirm)
        {
            this.state.onConfirm()
        }
	}

	render()
	{
		let header = <Text size="1">{this.state.title}</Text>
		let footer = (
            <>
                <Button className="ModalButton" onClick={() => this.setShow(false)}>
                    No
                </Button>
                <Button buttonStyle="1" className="ModalButton" onClick={() => this.onClick_confirm()}>
                    Yes
                </Button>
            </>
        )

		return (
			<Modal
				show={this.state.show}
				className="ModalConfirm sizeNormal"
				onClose={() => this.setShow(false)}
				header={header}
				footer={footer}>
				<Text color="2">
                	{this.state.text}                
				</Text>
			</Modal>
		)
	}
}

export default ModalConfirm;