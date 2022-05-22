import React from 'react';

//libs
import {LSymbols} from '../../../../libs/LSymbols'

//components
import { Button, Group } from '../../'

//modals
import ModalLogin from '../../../Modals/ModalLogin/ModalLogin'

//css
import './ButtonLoginLogout.css'

class ButtonLoginLogout extends React.Component
{
    constructor(props)
	{   
		super(props)

		//init state
		this.state = 
		{
			user: window.chef.user
		}	

        this.refreshUser = this.refreshUser.bind(this)
	}

	componentDidMount()
	{	
		document.addEventListener('user_userInfo', this.refreshUser)
	}

    componentWillUnmount()
	{
		document.removeEventListener('user_userInfo', this.refreshUser)      
	}

    refreshUser()
    {
        this.setState({ user: window.chef.user })
    }

    async onClick_loginLogout()
    {
        if (this.state.user !== null)
        {
            await window.chef.logout()
        }
        else
        {
            ModalLogin.showModal_Login()
        }
    }
    
	render()
	{
		return (            
            <Group>
                <ModalLogin />
                <Button
                    buttonStyle={this.state.user === null ? 0 : 1}
                    className="ButtonLoginLogout"
                    onClick={() => this.onClick_loginLogout()}>
                    {LSymbols.shieldLock(this.state.user === null ? "login" : "logout")}
                </Button>
            </Group>			
		)
	}
}

export default ButtonLoginLogout;