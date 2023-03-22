import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import fleche from "../../../public/fleche.png";
import { dataShowDcaInfo } from "./dummydata";
import USDC from "./../Coin/usdc";
import WETH from "./../Coin/weth";
import { useAccount, useContractRead, usePrepareContractWrite, useContractWrite } from "wagmi";
import { ABI_QYP } from "../../abi/ABI_QYP";
import { SmartContract, USDC_address } from "../Coin/addresses";
import { BigNumber, ethers } from "ethers";
import { DCA } from "@/types";

function Table({
  OpenModalTable,
  setOpenModalTable,
  dca,
}: {
  OpenModalTable: boolean;
  setOpenModalTable: Dispatch<SetStateAction<boolean>>;
  dca: DCA;
}) {
  const { address, isConnecting, isDisconnected } = useAccount();

  const { config, error } = usePrepareContractWrite({
    address: SmartContract,
    abi: ABI_QYP,
    functionName: "withdrawFunds",
    args: [dca.index, false],
  });
  const { write } = useContractWrite(config);

  const { data } = useContractRead({
    address: SmartContract,
    abi: ABI_QYP,
    functionName: "showDcaInfo",
    args: [address, dca.index],
    onSuccess(data) {
      console.log(data);
    },
    onError(error) {
      console.log("error table");
    },
  });
  if (!OpenModalTable) return null;
  return (
    <div className="w-3/4 h-3/4 fixed inset-0 m-auto bg-slate-700 rounded-xl">
      <p className="text-right mr-5 mt-3 cursor-pointer" onClick={() => setOpenModalTable(false)}>
        X
      </p>
      <div className="text-center">
        <h1 className="text-3xl mb-5">DCA position {dca.index.toString()}</h1>
        <h2 className="flex justify-center text-xl mb-1">
          <USDC></USDC> <Image src={fleche} alt="fleche icon" height={20} /> <WETH></WETH>
        </h2>
        <p>
          Amount per period:{" "}
          {dca.tokenIn == USDC_address
            ? ethers.utils.formatUnits(dca.amountPerPeriod.toString(), 6).toString()
            : ethers.utils.formatUnits(dca.amountPerPeriod.toString(), 18).toString()}
        </p>
        <p>Total Orders: {dca.numberOfPeriod.toString()}</p>
      </div>
      <div className="h-96 overflow-y-auto w-3/4 m-auto mt-3">
        <table className="border-solid border-2 border-white w-full m-auto">
          <thead>
            <tr>
              <th>orderId</th>
              <th>Purchase Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order) => {
              return (
                <tr key={order.orderId.toString()}>
                  <td>{order.orderId.toString()}</td>
                  <td>{order.price}</td>
                  <td>
                    {new Intl.NumberFormat("en-us", { style: "percent", maximumFractionDigits: 2 }).format(
                      1 - order.makerAmountRemaining / order.makerAmountTotal
                    )}{" "}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex w-3/4 m-auto">
          <button
            className="mx-auto py-2 px-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-lg"
            onClick={write}
          >
            Withdraw position
          </button>
        </div>
      </div>
    </div>
  );
}

export default Table;
