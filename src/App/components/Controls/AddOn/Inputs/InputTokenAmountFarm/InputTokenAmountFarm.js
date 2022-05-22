//components
import { InputTokenAmount } from '../../..'

class InputTokenAmountFarm extends InputTokenAmount
{
    constructor(props)
	{   
		super(props)
		 
		//init state
		this.state = 
		{
            ...this.state,
            onChangeFarm: props.onChangeFarm || null,
            farm: props.farm,
            showIcon: props.showIcon && true
		}

        this.checkUpdate_farm = this.checkUpdate_farm.bind(this)
	}

    componentDidMount()
	{	
        super.componentDidMount()
        document.addEventListener('farm_userInfo', this.checkUpdate_farm)
	}

    componentWillUnmount()
	{	
        super.componentWillUnmount()
        document.removeEventListener('farm_userInfo', this.checkUpdate_farm)
	}

    checkUpdate_token(_data)
    {
        if (_data.detail.address === this.state.token?.address)
        {
            if (!this.state.onChangeMoonChef
                && !this.state.onChangeToken
                && !this.state.onChangeFarm)
            {
                this.setState({ max: this.state.token.userBalance })
            }
            else
            {
                super.checkUpdate_token(_data)
            }      
        }
    }

    checkUpdate_farm(_data)
    {
        if (this.props.farm
            && _data.detail.address === this.props.farm.address)
        {
            if (this.state.onChangeFarm)
            {
                this.setState({ max: this.state.onChangeFarm() })
            }        
        }
    }	
}

export default InputTokenAmountFarm;