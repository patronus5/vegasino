import React from 'react'
import { Router, withRouter } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { ToastContainer } from 'react-toastify'

//config
import {config} from '../../config'

//components
import PageManager from '../Core/PageManager'
import ModalManager from '../Core/ModalManager'

//components
import { Panel, Group, Button, Text, Input, Link, Image } from '../Controls'
import { ButtonSelectChain, ButtonConnectWallet, ButtonGasPrice, ButtonTokenPrice } from '../Controls'

//css
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './Template_base.css'
import './Template_MoonVault.css'

//consts
const history = createBrowserHistory()

class TemplateMoonVault extends React.Component
{
	constructor(props)
	{   
		super(props)
		
		//init state
		this.state = 
		{
			src: props.src,
			className: props.className || "",
			updateRevision: 0	
		}
		window.chef.template = this

		this.updateView = this.updateView.bind(this)
	}

	componentDidMount()
	{	
        document.addEventListener('user_userInfo', this.updateView)
	}

	componentWillUnmount()
	{	
        document.removeEventListener('user_userInfo', this.updateView)
	}

    updateView()
	{
		this.setState({ updateRevision: this.state.updateRevision + 1 })
	}

	renderMenu()
	{
		//check menu list
		let menuList = [];
		PageManager.pages.forEach(p => menuList.push(p));
		if (window.chef.moonChef?.isValidChain())
		{
			//native chain
			PageManager.nativeChainPages.forEach(p => menuList.push(p));
		}

		//menu
		const menuItems = menuList.map((page) => 
		{
			const path = this.state.currentPath ?? this.props.location.pathname;
			let className = path.substr(1) === page.id ? "active" : null;

			if (className
				&& this.props.animateMenuGlow)
			{
				className += " glow";
			}
			
			return (
				<React.Fragment key={page.id}>
					<Link nav={true} href={"/" + page.id} className={className}>
						{page.label}
					</Link>
				</React.Fragment>
			);
		})

		//token price or gas
		let priceOrGas = <></>
		if (config.template.showNativePrice)
		{
			priceOrGas = <ButtonTokenPrice token={window.chef.findToken(config.page.nativeToken)} />
		}
		else if (!config.template.hideGas)
		{
			priceOrGas = <ButtonGasPrice />
		}
		
		return (
			<>
				<nav>
					<Group className="Menu">
						<Image
							className="logo"
							src="logo.png"
						/>
						{menuItems}
					</Group>
					<Group className="ConnectionButtons">
						{priceOrGas}
						<ButtonSelectChain />
						<ButtonConnectWallet />
					</Group>
				</nav>
			</>
		)
	}

	async onClick_login()
	{
		let form = document.getElementById("formLogin")
		await window.chef.login(form['user'].value, form['password'].value)
	}

	checkLogin()
	{
		if (window.chef.isLoggedIn())
		{
			return true
		}

		return (
			<Panel className="Template_Login">
				{this.renderLogin()}
			</Panel>
		)
	}

	renderLogin()
	{
		return (
			<Group className="Login">
				<form id="formLogin" onSubmit={(_eventArgs) => _eventArgs.preventDefault()}>
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
					<Button buttonStyle="1" onClick={() => this.onClick_login()}>
						login
					</Button>
				</form>
			</Group>
		)
	}
	
	routeChanged(path)
	{
		if (path) 
		{
			this.setState({ currentPath: path });
		}
	}

	render()
	{
		let cn = "App TemplateMoonVault " + this.state.className 		
		
		return (				
			<Router history={history}>
				<div className={cn}>
					<ModalManager />	
					<ToastContainer
						position="top-right"
						autoClose={5000}
						hideProgressBar={false}
						newestOnTop={false}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable={false}
						pauseOnHover
						toastClassName="dark-toast" />	
					<header className="Menu">
						{this.renderMenu()}
					</header>
					<main className="Content">
						<PageManager routeChanged={this.routeChanged.bind(this)} />
					</main>
					<footer className="Menu">
						{this.renderMenu()}
					</footer>
				</div>
			</Router>	
		)
	}
}

export default withRouter(TemplateMoonVault);