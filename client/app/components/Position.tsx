import { useState } from "react";
import Image from "next/image";
import fleche from "../../public/fleche.png";
import Table from "./Modal/Table";
import { ABI_QYP } from "../abi/ABI_QYP";
import { useAccount, useContractRead } from "wagmi";
import { SmartContract } from "./Coin/addresses";
import USDC from "./Coin/usdc";
import WETH from "./Coin/weth";


export const Position = () => {
  const [OpenModalTable, setOpenModalTable] = useState(false);
  const [position, setPosition] = useState(true);
  const { isConnected } = useAccount()

  function toggleTable() {
    setOpenModalTable(!OpenModalTable);
  }

  const { data, isError, isLoading } = useContractRead({
    address: SmartContract,
    abi: ABI_QYP,
    functionName: "allDcaPositions",
    args: [0]
  });

  return (
    <div className="inline mt-5 w-10/12 m-auto overflow-auto pb-16 font-mono">
      {position && (
        <div className="flex flex-wrap h-full overflow-auto">
          <div
            className="text-white border-solid border-2 border-white p-3 rounded-xl m-5 cursor-pointer hover:bg-slate-700"
            onClick={toggleTable}
          >
            <h1 className="flex text-center text-3xl mb-3">
              <USDC></USDC> <Image src={fleche} alt="fleche icon" height={40} /> <WETH></WETH>
            </h1>
            <p>Period time : 30 days</p>
            <p>Amount per period : $2</p>
            <p>Number of period : 5</p>
            <div className="mt-5 bg-black h-2.5">
              <div className="w-1/12 bg-white h-2.5"> </div>
            </div>
            <Table OpenModalTable={OpenModalTable} setOpenModalTable={setOpenModalTable} />
          </div>
          <div
            className="text-white border-solid border-2 border-white p-3 rounded-xl m-5 cursor-pointer hover:bg-slate-700"
            onClick={toggleTable}
          >
            <h1 className="flex text-center text-3xl mb-3">
              <USDC></USDC> <Image src={fleche} alt="fleche icon" height={40} /> <WETH></WETH>
            </h1>
            <p>Period time : 10 days</p>
            <p>Amount per period : 150$</p>
            <p>Number of period : 5</p>
            <div className="mt-5 bg-black h-2.5">
              <div className="w-8/12 bg-white h-2.5"> </div>
            </div>
          </div>
          <div
            className="text-white border-solid border-2 border-white p-3 rounded-xl m-5 cursor-pointer hover:bg-slate-700"
            onClick={toggleTable}
          >
            <h1 className="flex text-center text-3xl mb-3">
              <WETH></WETH> <Image src={fleche} alt="fleche icon" height={40} /> <USDC></USDC>
            </h1>
            <p>Period time : 1 week</p>
            <p>Amount per period : 75$</p>
            <p>Number of period : 24</p>
            <div className="mt-5 bg-black h-2.5">
              <div className="w-12/12 bg-white h-2.5"> </div>
            </div>
          </div>
        </div>
      )}
      {!position && (
        <div className="mt-10 text-center">
          <p className="text-3xl">No position currently</p>
          <a className="text-xl">Start by creating one</a>
        </div>
      )}
    </div>
  );
};
