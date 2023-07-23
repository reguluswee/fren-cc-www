import { Chain, chain } from "wagmi";
import FRENMultichainABI from "~/abi/FRENMultichainABI";
import { bscMainnet } from "~/lib/chains/bscMainnet";

export const xenContract = (contractChain?: Chain) => {
  switch (contractChain?.id) {
    case bscMainnet.id:
      return {
        addressOrName: "0xE6A768464B042a6d029394dB1fdeF360Cb60bbEb",
        contractInterface: FRENMultichainABI,
        chainId: contractChain.id,
      };
    
    default:
      return {
        addressOrName: "0xE6A768464B042a6d029394dB1fdeF360Cb60bbEb",
        contractInterface: FRENMultichainABI,
        chainId: chain.mainnet.id,
      };
  }
};
