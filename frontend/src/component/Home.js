import { useAccountInfo } from '@particle-network/connect-react-ui';
import '../App.css';
import DefaultConnectButton from './ConnectButton';
import { Flex } from 'antd/lib';
import { useContext } from 'react';
import { UIContext } from '../context/useUI';

export default function Home() {
    const { account } = useAccountInfo()
    const { uiName, uiData } = useContext(UIContext);

    if(uiName && account) return null;
    
    return (
        <header class="masthead text-center text-white">
            <div class="masthead-content">
                <div class="container px-5">
                    <h1 class="masthead-heading mb-0">Unlock web3 with AI</h1>
                    <h2 class="masthead-subheading mb-0">Your Secure Companion!</h2>
                    {!account? <Flex justify="center">
                        <DefaultConnectButton />
                    </Flex> : <a class="btn btn-warning btn-xl rounded-pill mt-5" href="#scroll">Welcome</a>
                    }
                </div>
            </div>
            <div class="bg-circle-1 bg-circle"></div>
            <div class="bg-circle-2 bg-circle"></div>
            <div class="bg-circle-3 bg-circle"></div>
            <div class="bg-circle-4 bg-circle"></div>
        </header>
    )
}