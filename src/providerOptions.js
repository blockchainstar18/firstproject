import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import walletlink from 'walletlink';
const rpcUrl = `https://eth-ropsten.alchemyapi.io/v2/gAQOlZdHS3eIpGULYGNg2jRhyxwmA-DS`;

export const providerOptions = {
  walletlink: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: "Web 3 Modal Demo", // Required
      infuraId: process.env.INFURA_KEY // Required unless you provide a JSON RPC url; see `rpc` below
    }
  },
  // mewconnect: {
  //   package: () => import('@myetherwallet/mewconnect-web-client'),
  //   packageFactory: true,
  //   options: {
  //     rpc: rpcUrl,
  //     description: ''
  //   }
  // },
  // walletlink: {
  //   package: walletlink,
  //   // packageFactory: true,
  //   options: {
  //     appName: 'Web 3 Modal Demo',
  //     jsonRpcUrl: rpcUrl,
  //   }
  // },

  // walletconnect: {
  //   package: WalletConnect, // required
  //   options: {
  //     infuraId: process.env.INFURA_KEY // required
  //   }
  // }
};