import React from 'react';

//libs
import {LSymbols} from '../../../libs/LSymbols'

//components
import Modal from '../Modal'
import { Text, Button } from '../../Controls'

//css
import './ModalTransaction.css'

//vars
var modal_transaction = null

class ModalTransaction extends React.Component
{
    constructor(props)
	{   
		super(props)
		
		//init state
		this.state = 
		{
            show: props.show || false,
            stage: 0,
            data: null,
            txID: -1
		}

		//vars
		modal_transaction = this
	}

	static showModal(_txID)
	{
        modal_transaction.setState(
        {
            stage: 0,
            txID: _txID
        })
		modal_transaction.setShow(true)        
	}

    static setTransactionStage(_txID, _stage, _data)
    {
        if (_txID === modal_transaction.state.txID)
        {
            modal_transaction.setState(
            {
                stage: _stage,
                data: _data
            })
        }
    }

	setShow(_show)
	{
		this.setState(
		{
			show: _show
		})
	}

    handleErrorData(_error)
    {
        let autoClose = false
        switch (_error.code)
        {
            case 4001:
                //user denied transaction
                autoClose = true
                break

            default:
                //do nothing

        }

        return {
            message: _error.message,
            reason: _error.data?.reason,
            autoClose
        }
    }

    getStageData()
    {
        const tx = window.chef.findTransaction(this.state.txID)
        const description = tx?.description || ""
        switch (this.state.stage)
        {
            case -1:
                const err = this.handleErrorData(this.state.data)
                return {
                    title: "Failed",
                    text: <>The transaction failed with error:<br />{err.message}</>,
                    description,
                    icon: LSymbols.error('svgError')
                }

            case 0:
                return {
                    title: "Waiting for Confirmation",
                    text: "Confirm transaction in your wallet",
                    description,
                    icon: LSymbols.loading('svgLoading')
                }

            case 1:
            case 2:
                return {
                    title: "Pending Transaction",
                    text: "Waiting for transaction to be processed",
                    description: <>{description}</>,
                    icon: LSymbols.submitted('svgSubmitted')
                }

            case 3:
                return {
                    title: "Complete",
                    text: "Transaction successful",
                    description: <>{description}</>,
                    icon: LSymbols.success('svgSuccess')
                }

            default:
                return null
        }
    }

	render()
	{
        //get stage data
        const contentData = this.getStageData()

        //heaer & footer
		let header = <Text size="1">{contentData.title}</Text>
		let footer = (
            <>
                <Button className="ModalButton" onClick={() => this.setShow(false)}>
                    dismiss
                </Button>
            </>
        )

        //content
		return (
			<Modal
				show={this.state.show}
				className="ModalTransaction sizeNormal"
                onClose={() => this.setShow(false)}
				header={header}
				footer={footer}>
                {contentData.icon}
				<Text color="2">
                	{contentData.text}                
				</Text>
                <Text color="1" size="-1">
                	{contentData.description}                
				</Text>
			</Modal>
		)
	}
}

export default ModalTransaction;