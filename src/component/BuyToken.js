import { useAccountInfo, useConnectKit } from '@particle-network/connect-react-ui';
import { Button } from 'antd';

export default function BuyToken() {

    //use this in react component.
    const { account, accountLoading } = useAccountInfo();
    const connectKit = useConnectKit();

    const handleclick = () => {
        // To set target and features for custom window style, same as window.open().
        if (!account) return null;

        connectKit.particle.openBuy({
            walletAddress: account,
            network: connectKit.particle.getChain().name,
        }, "", "popup,left=100,top=100,width=620,height=620");
    }

    if (!account) return null;

    return (
        <>
        <Button onClick={handleclick}>
            Buy Tokens
        </Button>
        </>
    )
}