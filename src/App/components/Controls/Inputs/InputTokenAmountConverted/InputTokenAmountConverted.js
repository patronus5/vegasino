import React from 'react';

//libs
import {LWeb3} from '../../../../libs/LWeb3'

//components
import { TokenIcon, Text, Group, Input, ButtonAddToken } from '../..'

//css
import './InputTokenAmountConverted.css'

class InputTokenAmountConverted extends React.Component
{
    constructor(props)
	{   
		super(props)
		 
		//init state
		this.state = 
		{
            updateRevision: 0,
			id: props.id || 'dialog_tokenInputConverted',
            onChange: props.onChange || null,
            onChangeToken: props.onChangeToken || null,
            token: props.token,
            tokenConvert: props.tokenConvert || window.chef.stableToken,
            showIcon: props.showIcon && true,
            initialValue: props.value
		}

        this.checkUpdate_token = this.checkUpdate_token.bind(this)
        this.ref_input = React.createRef()
	}

    componentDidMount()
	{	
        document.addEventListener('token_priceInfo', this.checkUpdate_token)
	}

    componentWillUnmount()
	{	
        document.removeEventListener('token_priceInfo', this.checkUpdate_token)
	}

    checkUpdate_token(_data)
    {
        if (LWeb3.checkEqualAddress(_data.detail.address, this.props.token.address))
        {
            this.update()      
        }
    }

    update()
	{
		this.setState({ updateRevision: this.state.updateRevision + 1 })
	}

    getAsUint256()
	{
		const v = LWeb3.tokensToUint256String(this.ref_input.current.getValue())
		const val = window.chef.web3_data.eth.abi.encodeParameter("uint256", v);
		
		return val;
	}

    onChange(_e)
    {
        this.update()
        if (this.state.onChange)
        {
            this.state.onChange(_e)
        }
    }

    convertTokenAmount(_tokenFrom, _tokenTo, _amount)
    {
        //tokenFrom
        const tokenFrom_liquidityValue = window.chef.toBN(_tokenFrom.liquidityValue)
        const tokenFrom_liquidityAmount = window.chef.toBN(_tokenFrom.liquidityAmount)

        //tokenTo
        const tokenTo_liquidityValue = window.chef.toBN(_tokenTo.liquidityValue)
        const tokenTo_liquidityAmount = window.chef.toBN(_tokenTo.liquidityAmount)

        //convert over stable
        const amount = window.chef.toBN(_amount || "0")
        const priceFromAmount = tokenFrom_liquidityValue.mul(amount).div(tokenFrom_liquidityAmount)
        const convertedTo = tokenTo_liquidityAmount.mul(priceFromAmount).div(tokenTo_liquidityValue)
        const convertedStr = convertedTo.toString(10)

        return convertedStr
    }

	render()
	{
        const classes = [ "InputTokenAmountConverted" ];

        //converted
        const val = (this.ref_input?.current?.getValue() || LWeb3.fullFormatTokens(this.props.value, this.state.token, true));
        let convertedAmount = this.convertTokenAmount(this.state.token, this.state.tokenConvert || window.chef.stableToken, LWeb3.tokensToUint256String(val || "0"))
        let converted = (
            <Group className="converted">
                {LWeb3.smartFormatTokens(convertedAmount, this.state.tokenConvert, true)} {this.state.tokenConvert.symbol}
            </Group>
        )

        //name
        let name = this.state.token.symbol
        if (this.state.token.token0 !== null)
        {
            name = 'LP'
        }

        //label
        let label = null;
        if (this.props.label)
        {
            label = <Text size="1" className="Label">{this.props.label}</Text>;
        }

        //icon
        let icon = null;
        if (this.state.showIcon)
        {
            icon = <TokenIcon token={this.state.token} height="60" width="60" />;
            classes.push("Icon")
        }

        let size = 0
        if (name.length > 4)
        {
            size = -1
        }
        if (name.length > 8)
        {
            size = -3
        }
		return (			
            <Group className={classes.join(' ')}>
                <Group>
                    {converted}
                    <Group className="inputContainer">
                        <Group className="LabelContainer">
                            {label}
                        </Group>
                        {icon}
                        <Input
                            id={this.state.id}
                            ref={this.ref_input}
                            onChange={(_e) => this.onChange(_e)}
                            type="number"
                            min="0"
                            placeholder="0"
                            value={val} />
                        <Group className="info">
                            <Text size={size}>
                                {name}
                            </Text>
                        </Group>
                    </Group>
                    <Group className="AddButton">
                        <ButtonAddToken token={this.state.token} mode={'text'} />
                    </Group>
                </Group>
            </Group>
		)
	}
}

export default InputTokenAmountConverted;