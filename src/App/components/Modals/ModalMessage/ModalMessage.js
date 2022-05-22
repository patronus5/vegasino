import React from 'react';

//components
import Modal from '../Modal'
import { Text, Button } from '../../Controls'

//vars
var modal_message = null

class ModalMessage extends React.Component
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
			buttonText: "",
            onClose: null,					
		}

		//vars
		modal_message = this
	}

	static showModal(_title, _text, _buttonText, _onClose)
	{
		modal_message.setShow(true)
        modal_message.setState(
        {
            title: _title,
            text: _text,
			buttonText: _buttonText || "OK",
			onClose: _onClose || null
        })
	}

	setShow(_show)
	{
		this.setState(
		{
			show: _show
		})
	}

	async onClick_close()
	{
        this.setShow(false)
		if (this.state.onClose)
		{
			this.state.onClose();
		}
	}

	render()
	{
		let header = <Text size="1">{this.state.title}</Text>
		let footer = (
            <>
                <Button className="ModalButton" onClick={() => this.onClick_close()}>
                    {this.state.buttonText}
                </Button>
            </>
        )

		return (
			<Modal
				show={this.state.show}
				className="ModalMessage sizeNormal"
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

export default ModalMessage;