import React from 'react';

//components
import Modal from '../Modal'
import { Text, Button, Group, Input } from '../../Controls'

//css
import './ModalLogin.css'

//vars
var modal_login = null

class ModalLogin extends React.Component
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
		modal_login = this
	}

	static showModal_Login()
	{
		modal_login.setShow(true)
	}

	setShow(_show)
	{
		this.setState(
		{
			show: _show
		})
	}

	async onClick_login()
	{
		let form = document.getElementById("formLoginButton")
		await window.chef.login(form['user'].value, form['password'].value)
        this.setShow(false)
	}

	render()
	{
		let header = <Text size="1">Login:</Text>
		let footer = (
            <>
                <Button buttonStyle="1" className="ModalButton" onClick={() => this.onClick_login()}>
                    login
                </Button>
            </>
        )

		return (
			<Modal
				show={this.state.show}
				className="ModalLogin sizeNormal"
				onClose={() => this.setShow(false)}
				header={header}
				footer={footer}>
                <Group className="login">
                    <form id="formLoginButton" onSubmit={(_eventArgs) => _eventArgs.preventDefault()}>
                        <Group className="user">
                            <Text>
                                User:						
                            </Text>
                            <Input name="user" type="text" />
                        </Group>
                        <Group className="password">
                            <Text>
                                Password:						
                            </Text>
                            <Input name="password" type="password" />
                        </Group>                        
                    </form>
                </Group>
			</Modal>
		)
	}
}

export default ModalLogin;