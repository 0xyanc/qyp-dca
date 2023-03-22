import { DCA } from "@/types";
import { Dispatch, MouseEventHandler, SetStateAction } from "react";
import { USDC_address } from "./Coin/addresses";
import fleche from "../../public/fleche.png";
import USDC from "./Coin/usdc";
import WETH from "./Coin/weth";
import Image from "next/image";
import Table from "./Modal/Table";
import { ethers } from "ethers";

export const PositionCard = ({
  toggleTable,
  dca,
  OpenModalTable,
  setOpenModalTable,
}: {
  toggleTable: MouseEventHandler<HTMLDivElement>;
  dca: DCA;
  OpenModalTable: boolean;
  setOpenModalTable: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div
      className="text-white border-solid border-2 border-white p-3 rounded-xl m-5 cursor-pointer hover:bg-slate-700"
      onClick={toggleTable}
    >
      <h1 className="flex text-center text-3xl mb-3">
        {dca.tokenIn == USDC_address ? <USDC /> : <WETH />} <Image src={fleche} alt="fleche icon" height={40} />{" "}
        {dca.tokenIn == USDC_address ? <WETH /> : <USDC />}
      </h1>
      <p>Period time : {dca.periodTimeInDays.toString()} days</p>
      <p>
        Amount per period :{" "}
        {dca.tokenIn == USDC_address
          ? ethers.utils.formatUnits(dca.amountPerPeriod.toString(), 6).toString()
          : ethers.utils.formatUnits(dca.amountPerPeriod.toString(), 18).toString()}
      </p>
      <p>Number of period : {dca.numberOfPeriod.toString()}</p>
      <div className="mt-5 bg-black h-2.5">
        <div className="w-1/5 bg-white h-2.5"> </div>
      </div>
      <Table OpenModalTable={OpenModalTable} setOpenModalTable={setOpenModalTable} dca={dca} />
    </div>
  );
};
