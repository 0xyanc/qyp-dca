import { BigNumber } from "ethers";

export interface DCA {
  index: BigNumber;
  periodTimeInDays: BigNumber;
  amountPerPeriod: BigNumber;
  numberOfPeriod: BigNumber;
  tokenIn: `0x${string}`;
}
