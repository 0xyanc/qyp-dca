import { Dispatch, SetStateAction } from "react";

import Image from "next/image";
import fleche from "../../../public/fleche.png";
import { dataShowDcaInfo } from "./dummydata";
import USDC from "./../Coin/usdc";
import WETH from "./../Coin/weth";
import { useAccount, useContractRead, usePrepareContractWrite, useContractWrite } from "wagmi";
import { ABI_QYP } from "../../abi/ABI_QYP";

function Table({
  OpenModalTable,
  setOpenModalTable,
}: {
  OpenModalTable: boolean;
  setOpenModalTable: Dispatch<SetStateAction<boolean>>;
}) {
  const SmartContract: `0x${string}` = "0x04C89607413713Ec9775E14b954286519d836FEf";
  const { address, isConnecting, isDisconnected } = useAccount();

  const { config, error } = usePrepareContractWrite({
    address: SmartContract,
    abi: ABI_QYP,
    functionName: "withdrawFunds",
    args: [0, false],
  });
  const { write } = useContractWrite(config);

  const { data, isLoading } = useContractRead({
    address: SmartContract,
    abi: ABI_QYP,
    functionName: "showDcaInfo",
    args: [address, 0],
    onSuccess(data) {
      console.log(data);
    },
  });
  //   console.log(error);
  if (!OpenModalTable) return null;
  return (
    <div className="w-3/4 h-3/4 fixed inset-0 m-auto bg-slate-700 rounded-xl">
      <p className="text-right mr-5 mt-3 cursor-pointer" onClick={() => setOpenModalTable(false)}>
        X
      </p>
      <div className="text-center">
        <h1 className="text-3xl mb-5">DCA position #3</h1>
        <h2 className="flex justify-center text-xl mb-1">
          <USDC></USDC> <Image src={fleche} alt="fleche icon" height={20} /> <WETH></WETH>
        </h2>
        <p>Amount per period: 100$</p>
        <p>Remaining Orders: 9</p>
      </div>
      <div className="h-96 overflow-y-auto w-3/4 m-auto mt-3">
        <table className="border-solid border-2 border-white w-full m-auto mb-2">
          <thead>
            <tr>
              <th>Date</th>
              <th>Purchase price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>19/03/2023</td>
              <td>1500$</td>
              <td>V</td>
            </tr>
          </tbody>
        </table>
        {/* <table className="border-solid border-2 border-white w-full m-auto">
          <thead>
            <tr>
              <th>orderId</th>
              <th>Submission Date</th>
              <th>Purchase Price</th>
              <th>makerAmountTotal</th>
              <th>makerAmountRemaining</th>
            </tr>
          </thead>
          <tbody>
            {dataShowDcaInfo.map((order) => {
              const submissionDate = new Date(1679220297 * 1000);
              const readableDate = submissionDate.toLocaleString().substring(0, 9);
              return (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{readableDate}</td>
                  <td>{order.price}$</td>
                  <td>{order.makerAmountTotal}</td>
                  <td>{order.makerAmountRemaining}</td>
                </tr>
              );
            })}
          </tbody>
        </table> */}
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
