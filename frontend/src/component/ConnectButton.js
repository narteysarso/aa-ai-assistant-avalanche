import '@particle-network/connect-react-ui/dist/index.css';
import { ConnectButton} from '@particle-network/connect-react-ui';
import { Avatar, Button, Flex } from 'antd';
import { useState } from 'react';
import { getNativeTokenBalance } from '../service/covalent';

export default function DefaultConnectButton() {
    //use this in react component.
    const [accountBalance, setBalance] = useState(0);

    return <ConnectButton.Custom style={{ background: "transparent" }}>
        {({ account, chain, openAccountModal, openConnectModal, openChainModal, accountLoading }) => {
           if(chain && chain.id && account) {
            getNativeTokenBalance({chain: chain.id, account}).then((balance) => setBalance(balance.substring(0, 6)));
            
           }
            return (
                <Flex>
                    {!account && <Button type="primary" onClick={openConnectModal} disabled={!!account}>
                        Login with Particle
                    </Button>}

                    {account && (
                        <>
                            <Button type="primary" onClick={openAccountModal} disabled={!account} loading={accountLoading} >
                                <Flex>
                                    {account?.substring(0, 5)}...{account?.substring(37)}: {accountBalance} &nbsp; {<Avatar size={"small"} src={chain?.icon} />}
                                </Flex>
                            </Button>

                            <Button type="primary" onClick={openChainModal} disabled={!account}>
                                {chain?.fullname}
                            </Button>
                        </>
                    )}
                </Flex>
            );
        }}
    </ConnectButton.Custom>
};
