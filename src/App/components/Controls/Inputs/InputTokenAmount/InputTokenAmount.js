import React from 'react';

//libs
import {LWeb3} from '../../../../libs/'

//components
import { TokenIcon, Text, Button, Group, Input, ButtonAddToken } from '../../'

//css
import './InputTokenAmount.css'

class InputTokenAmount extends React.Component
{
    constructor(props)
	{   
		super(props)
		 
		//init state
		this.state = 
		{
            updateRevision: 0,
			id: props.id || 'dialog_tokenInput',
            onChange: props.onChange || null,
            onChangeToken: props.onChangeToken || null,
            token: props.token,
            max: props.max,
            showIcon: props.showIcon && true
		}

        this.checkUpdate_app = this.checkUpdate_app.bind(this)
        this.checkUpdate_token = this.checkUpdate_token.bind(this)
        this.ref_input = React.createRef()
	}

    componentDidMount()
	{	
        document.addEventListener('app_reload', this.checkUpdate_app)
        document.addEventListener('token_userInfo', this.checkUpdate_token)
	}

    componentWillUnmount()
	{	
        document.removeEventListener('app_reload', this.checkUpdate_app)
        document.removeEventListener('token_userInfo', this.checkUpdate_token)
	}

    checkUpdate_app()
    {
        if (!this.state.token)
        {
            this.setState({ max: window.chef.userCoinBalance })
        }
    }

    checkUpdate_token(_data)
    {
        if (LWeb3.checkEqualAddress(_data.detail.address, this.state.token?.address))
        {
            if (this.state.onChangeToken)
            {
                this.setState({ max: this.state.onChangeToken() })
            }
            else
            {
                this.setState({ max: this.state.token.userBalance })
            }
        }
    }

    onClick_max()
    {        
		this.ref_input.current.setValue(
            LWeb3.fullFormatTokens(
                    this.state.max,
                    (this.state.token || window.chef.wrappedCoin),
                    true))
        if (this.state.onChange)
        {
            this.state.onChange()
        }
    }

    getAsUint256()
	{        
		const v = LWeb3.tokensToUint256String(this.ref_input.current.getValue());
		const val = window.chef.web3_data.eth.abi.encodeParameter("uint256", v);
		
		return val;
	}

	render()
	{
        const classes = [ "InputTokenAmount" ];

        //available
        let balanceLabel = (this.props.balanceLabel || "Balance")
        let available
        available = (
            <Group className="available">
                {balanceLabel}: {LWeb3.smartFormatTokensDisplay(this.state.max, (this.state.token || window.chef.wrappedCoin), true)}
            </Group>
        )

        //name
        let name = this.state.token?.symbol || window.chef.currentChain?.coin || ""
        if (this.state.token
            && this.state.token.token0 !== null)
        {
            name = 'LP'
        }

        //label
        let label = <></>;
        if (this.props.label)
        {
            label = <Text size="1" className="Label">{this.props.label}</Text>;
        }

        //icon
        let icon = <></>;
        if (this.state.showIcon)
        {
            icon = <TokenIcon token={this.state.token} height="60" width="60" />;
            classes.push("Icon")
        }

        //add token
        let addToken = <></>
        if (this.state.token)
        {
            addToken = <ButtonAddToken token={this.state.token} mode={'text'} />
        }

        return (			
            <Group className={classes.join(' ')}>
                <Group>
                    {available}
                    <Group className="inputContainer">
                        <Group className="LabelContainer">
                            {label}
                        </Group>
                        {icon}
                        <Input
                            id={this.state.id}
                            ref={this.ref_input}
                            onChange={this.state.onChange}
                            type="number"
                            min="0"
                            placeholder="0" />
                        <Group className="info">
                            <Text size={name.length > 4 ? -1 : 0}>
                                {name}
                            </Text>
                            <Button buttonStyle="1" onClick={() => this.onClick_max()}>
                                Max
                            </Button>
                        </Group>
                    </Group>
                    <Group className="AddButton">
                        {addToken}
                    </Group>
                </Group>
            </Group>
		)
	}
}

export default InputTokenAmount;