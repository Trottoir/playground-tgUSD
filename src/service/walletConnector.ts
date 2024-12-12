import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import { Provider } from 'ethers';

export const wallets = [injectedModule()];
export const onboard = Onboard({
    wallets,
    chains: [
        {
            id: 31337,
            token: 'ETH',
            label: 'Testnet',
            rpcUrl: 'http://localhost:8545',
        },
        {
            id: 1,
            token: 'ETH',
            label: 'Ethereum Mainnet',
            rpcUrl: 'https://rpc.ankr.com/eth',
        },
    ],
    connect: {
        disableClose: false,
    },
    //   appMetadata
});
export let provider: Provider;
export async function connectedWallets() {
    const wallet = await onboard.connectWallet();
    provider = wallet[0].provider as unknown as Provider;

    return wallet[0];
}
