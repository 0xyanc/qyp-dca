import { useState } from "react";
import Image from "next/image";
import fleche from "../../public/fleche.png";
import Table from "./Modal/Table";
import { ABI_QYP } from "../abi/ABI_QYP";
import { useAccount, useContractRead } from "wagmi";
import { SmartContract, USDC_address } from "./Coin/addresses";
import USDC from "./Coin/usdc";
import WETH from "./Coin/weth";
import { Result } from "ethers/lib/utils.js";
import { DCA } from "@/types";
import { describe } from "node:test";
import { PositionCard } from "./PositionCard";
import { ethers } from "ethers";

export const Position = () => {
  const [OpenModalTable, setOpenModalTable] = useState(false);
  const [position, setPosition] = useState<DCA[] | null>(null);
  const { address, isConnected } = useAccount();

  function toggleTable() {
    setOpenModalTable(!OpenModalTable);
  }

  const { data, isError, isLoading } = useContractRead({
    address: SmartContract,
    abi: ABI_QYP,
    functionName: "getAllDcaPositions",
    args: [],
    onSuccess(data: Result) {
      let userPositions: DCA[] = [];
      data
        .filter((dca) => dca.owner == address)
        .map((dca) => {
          userPositions.push({
            index: dca.index,
            periodTimeInDays: dca.frequency,
            amountPerPeriod: dca.amountPerOrder,
            numberOfPeriod: dca.numberOfOrders,
            tokenIn: dca.tokenIn,
          });
        });

      console.log(userPositions);
      setPosition(userPositions);
    },
  });

  return (
    <div className="inline mt-5 w-10/12 m-auto overflow-auto pb-16 font-mono">
      {position && position.length > 0 && (
        <div className="flex flex-wrap h-full overflow-auto">
          {position.map((dca) => {
            return (
              <PositionCard
                key={ethers.utils.formatEther(dca.index)}
                toggleTable={toggleTable}
                dca={dca}
                OpenModalTable={OpenModalTable}
                setOpenModalTable={setOpenModalTable}
              />
            );
          })}
        </div>
      )}
      {position && position.length == 0 && (
        <div className="mt-10 text-center">
          <p className="text-3xl">No position currently</p>
          <a className="text-xl">Start by creating one</a>
        </div>
      )}
    </div>
  );
};
