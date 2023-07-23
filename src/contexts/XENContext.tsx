import React, { createContext, useState } from "react";
import {
  Chain,
  useToken,
  useFeeData,
  useBalance,
  useAccount,
  useNetwork,
  useContractRead,
  useContractReads,
} from "wagmi";
import { BigNumber } from "ethers";
import { chainList } from "~/lib/client";
import { xenContract } from "~/lib/xen-contract";

export interface Formatted {
  gasPrice: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
}

export interface FeeData {
  formatted: Formatted;
  gasPrice: BigNumber;
  lastBaseFeePerGas: BigNumber;
  maxFeePerGas: BigNumber;
  maxPriorityFeePerGas: BigNumber;
}

export interface TotalSupply {
  formatted: string;
  value: BigNumber;
}

export interface Token {
  address: string;
  decimals: number;
  name: string;
  symbol: string;
  totalSupply: TotalSupply;
}

export interface Balance {
  decimals: number;
  formatted: string;
  symbol: string;
  value: BigNumber;
}

interface IXENContext {
  setChainOverride: (chain: Chain) => void;
  feeData?: FeeData;
  xenBalance?: Balance;
  totalSupply: number;
  token?: Token;
}

const XENContext = createContext<IXENContext>({
  setChainOverride: (chain: Chain) => {},
  feeData: undefined,
  xenBalance: undefined,
  totalSupply: 0,
  token: undefined,
});

export const XENProvider = ({ children }: any) => {
  const [chainOverride, setChainOverride] = useState<Chain | undefined>();
  const [feeData, setFeeData] = useState<FeeData | undefined>();
  const [xenBalance, setXenBalance] = useState<Balance | undefined>();
  const [totalSupply, setTotalSupply] = useState(0);
  const [token, setToken] = useState<Token | undefined>();

  const { address } = useAccount();
  const { chain: networkChain } = useNetwork();

  const chain = chainOverride ?? networkChain ?? chainList[0];

  useBalance({
    addressOrName: address,
    token: xenContract(chain).addressOrName,
    onSuccess(data) {
      setXenBalance({
        decimals: data.decimals,
        formatted: data.formatted,
        symbol: data.symbol,
        value: data.value,
      });
    },
    // watch: true,
  });

  useToken({
    address: xenContract(chain).addressOrName,
    chainId: chain?.id,
    onSuccess(data) {
      setToken({
        address: data.address,
        decimals: data.decimals,
        name: data.name,
        symbol: data.symbol,
        totalSupply: {
          formatted: data.totalSupply.formatted,
          value: data.totalSupply.value,
        },
      });
    },
  });

  useContractReads({
    contracts: [
      {
        ...xenContract(chain),
        functionName: "totalSupply",
      },
    ],
    onSuccess(data) {
      setTotalSupply(Number(data[0]));
    },
    cacheOnBlock: true,
    watch: true,
  });

  useFeeData({
    formatUnits: "gwei",
    onSuccess(data) {
      setFeeData({
        formatted: {
          gasPrice: data.formatted.gasPrice ?? "",
          maxFeePerGas: data.formatted.maxFeePerGas ?? "",
          maxPriorityFeePerGas: data.formatted.maxPriorityFeePerGas ?? "",
        },
        gasPrice: data.gasPrice ?? BigNumber.from(0),
        lastBaseFeePerGas: data.lastBaseFeePerGas ?? BigNumber.from(0),
        maxFeePerGas: data.maxFeePerGas ?? BigNumber.from(0),
        maxPriorityFeePerGas: data.maxPriorityFeePerGas ?? BigNumber.from(0),
      });
    },
    // watch: true,
  });

  return (
    <XENContext.Provider
      value={{
        setChainOverride,
        feeData,
        xenBalance,
        totalSupply,
        token,
      }}
    >
      {children}
    </XENContext.Provider>
  );
};

export default XENContext;
