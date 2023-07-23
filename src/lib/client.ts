import { createClient, configureChains, chain, Chain } from "wagmi";

import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";

import { bscMainnet } from "~/lib/chains/bscMainnet";

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID;
const infuraId = process.env.NEXT_PUBLIC_INFURA_ID;

export const chainList = [
  // chain.mainnet,
  bscMainnet,
  // chain.polygon,
  // avaxMainnet,
  // ethwMainnet,
  // moonbeamMainnet,
  // evmosMainnet,
  // fantomMainnet,
  // dogechainMainnet,
  // bscTestnet,
  // okxMainnet,
  // chain.goerli,
  // pulseChain,
  // chain.polygonMumbai,
];

export const { chains, provider, webSocketProvider } = configureChains(
  chainList,
  [
    alchemyProvider({ apiKey: alchemyId, priority: 0 }),
    infuraProvider({ apiKey: infuraId, priority: 0 }),
    jsonRpcProvider({
      priority: 0,
      rpc: (c: Chain) => {
        if (c.id === chain.mainnet.id) {
          return null;
        }
        return { http: c.rpcUrls.default };
      },
    }),
    publicProvider({ priority: 1 }),
    // jsonRpcProvider({
    //   priority: 2,
    //   rpc: (chain: Chain) => ({
    //     http: "https://rpc.ankr.com/multichain",
    //   }),
    // }),
  ]
);

export const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: false,
        shimChainChangedDisconnect: false,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "FREN.MultiChain",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: false,
      },
    }),
  ],
  provider,
  webSocketProvider,
});
