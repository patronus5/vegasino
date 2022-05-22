import React from 'react';
import ReactModal from 'react-modal';

//components
import { Group, Button } from '../Controls'

//css
import './Modal.css'

class Modal extends React.Component
{
	render()
	{
        //close button
        let closeBtn = <></>
        if (this.props.onClose)
        {
            closeBtn = (
                <Button
                    className="close"
                    buttonStyle="1"
                    onClick={() => this.props.onClose()}>
                    X
                </Button>
            )
        }

        //conent
        let content = this.props.children
        if (!this.props.raw)
        {
            content = (
                <Group className="ModalContainer">
                    <Group className="Header">
                        {this.props.header}
                        {closeBtn}
                    </Group>
                    <Group className="Content">
                        {this.props.children}
                    </Group>
                    <Group className="Footer">                        
                        {this.props.footer}
                    </Group>
                </Group>
            )
        }

		return (
			<ReactModal
				isOpen={this.props.show}
				contentLabel="SwitchNetwork"
				className={"ModalContent " + this.props.className}
				overlayClassName="ModalOverlay">
                {content}				
			</ReactModal>
		)
	}
}

export default Modal;