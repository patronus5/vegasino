import React from 'react';

//modals
import ModalSelectChain from '../Modals/ModalSelectChain/ModalSelectChain'
import ModalConnectWallet from '../Modals/ModalConnectWallet/ModalConnectWallet'
import ModalConfirm from '../Modals/ModalConfirm/ModalConfirm'
import ModalTransaction from '../Modals/ModalTransaction/ModalTransaction'
import ModalMessage from '../Modals/ModalMessage/ModalMessage'

class ModalManager extends React.Component
{
    render()
    {
        return (
            <>            
                <ModalSelectChain />
                <ModalConnectWallet />
                <ModalConfirm />		
                <ModalTransaction />	
                <ModalMessage />
            </>			
		    )
    }
}

export default ModalManager;