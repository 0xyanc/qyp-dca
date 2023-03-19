import { useEffect, useState } from "react";

import { useContractReads, useAccount, erc20ABI, usePrepareContractWrite, useContractWrite } from "wagmi";
import { ABI_QYP } from "../abi/ABI_QYP";
import Image from "next/image";
import change_icon from "../../public/change.png";
import fleche from "../../public/fleche.png";

import USDC from "./Coin/usdc";
import WETH from "./Coin/weth";
import { BigNumber, ethers } from "ethers";

export const Create = () => {
  const WETH9_address: `0x${string}` = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
  const USDC_address: `0x${string}` = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
  const USDC_Goerli: `0x${string}` = "0x65afadd39029741b3b8f0756952c74678c9cec93";
  const WETH_Goerli: `0x${string}` = "0xccb14936c2e000ed8393a571d15a2672537838ad";

  const SmartContract: `0x${string}` = "0x04C89607413713Ec9775E14b954286519d836FEf";

  const [isTotal, setIsTotal] = useState(false);
  const [amount, setAmount] = useState("0");
  const [periodAmount, setPeriodAmount] = useState("0");
  const [nbOrder, setNbOrder] = useState("7");
  const [frequency, setFrequency] = useState("30");
  const [percentage, setPercentage] = useState("0");
  const [openPercent, setOpenPercent] = useState(false);
  const [price, setPrice] = useState("0");
  const [chosenCoin, setChosenCoin] = useState(true);
  const { address, isConnected } = useAccount();
  const [wethBalance, setWethBalance] = useState(0);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [errorPercent, setErrorPercent] = useState("");

  const { data } = useContractReads({
    contracts: [
      {
        address: USDC_address,
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [address!],
      },
      {
        address: WETH9_address,
        abi: erc20ABI,
        functionName: "balanceOf",
        args: [address!],
      },
      {
        address: WETH9_address,
        abi: erc20ABI,
        functionName: "allowance",
        args: [address!, SmartContract],
      },
      {
        address: USDC_address,
        abi: erc20ABI,
        functionName: "allowance",
        args: [address!, SmartContract],
      },
    ],
    onSuccess(data) {
      setWethAllowance(data[2]);
      setUsdcAllowance(data[3]);
      setUsdcBalance(parseInt(data[0]._hex.toString()) / 10 ** 6);
      setWethBalance(parseInt(data[1]._hex.toString()) / 10 ** 18);
    },
  });

  const [wethAllowance, setWethAllowance] = useState(BigNumber.from(0));
  const [usdcAllowance, setUsdcAllowance] = useState(BigNumber.from(0));

  const { config: config_USDC } = usePrepareContractWrite({
    address: USDC_address,
    abi: erc20ABI,
    functionName: "approve",
    args: [SmartContract, ethers.constants.MaxUint256],
  });
  const { write: write_USDC } = useContractWrite(config_USDC);

  const { config: config_WETH } = usePrepareContractWrite({
    address: WETH9_address,
    abi: erc20ABI,
    functionName: "approve",
    args: [SmartContract, ethers.constants.MaxUint256],
  });
  const { write: write_WETH } = useContractWrite(config_WETH);

  const { config, isError } = usePrepareContractWrite({
    address: SmartContract,
    abi: ABI_QYP,
    functionName: "submitDcaPosition",
    args: [
      //   parseInt(periodAmount) * parseInt(nbOrder),
      //   parseInt(periodAmount),
      //   parseInt(frequency),
      //   parseInt(nbOrder),
      //   chosenCoin ? WETH9_address : USDC_address,
      //   parseInt(percentage),
      5,
      1,
      5,
      5,
      WETH9_address,
      0,
    ],
  });
  console.log(isError);
  const { write } = useContractWrite(config);

  useEffect(() => {
    calculAmount();
  }, [amount, isTotal, nbOrder]);

  const handleFrequency = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFrequency(event.target.value);
  };

  const handleTotal = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isTrue = event.target.value === "true";
    setIsTotal(isTrue);
  };

  const handleNbOrder = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNbOrder(event.target.value);
  };

  function handleOpenPercent() {
    setOpenPercent(!openPercent);
  }

  function verifPercentage(event: React.ChangeEvent<HTMLInputElement>) {
    if (parseInt(event.target.value) > 0 && parseInt(event.target.value) < 100) {
      setPercentage(event.target.value);
      setErrorPercent("");
    } else {
      setErrorPercent("Please enter a number between 0 and 100");
    }
  }

  const calculAmount = () => {
    if (isTotal) {
      setPeriodAmount(
        new Intl.NumberFormat("en-US", { maximumSignificantDigits: 5 }).format(parseFloat(amount) / parseInt(nbOrder))
      );
    } else {
      setPeriodAmount(new Intl.NumberFormat("en-US", { maximumSignificantDigits: 5 }).format(parseFloat(amount)));
    }
  };

  return (
    <div className="flex mt-5 m-auto pb-16 font-mono text-white justify-around w-3/4">
      <div className="flex flex-col gap-2 border-2 rounded-lg p-2">
        {chosenCoin && (
          <div className="subcard flex flex-row">
            Buy
            <USDC></USDC>
            with
            <WETH></WETH>
            <p onClick={() => setChosenCoin(!chosenCoin)} className="cursor-pointer">
              <Image src={change_icon} alt="change icon" height={20} className="ml-8" />
            </p>
          </div>
        )}
        {!chosenCoin && (
          <div className="subcard flex flex-row">
            Buy
            <WETH></WETH>
            with
            <USDC></USDC>
            <p onClick={() => setChosenCoin(!chosenCoin)} className="cursor-pointer">
              <Image src={change_icon} alt="change icon" height={20} className="ml-8" />
            </p>
          </div>
        )}
        <div className="flex mx-auto gap-9" onChange={handleTotal}>
          <div className="flex gap-2">
            <input type="radio" name="invest" value="false" defaultChecked />
            <label>Amount per Period</label>
          </div>
          <div className="flex gap-2">
            <input type="radio" name="invest" value="true" />
            <label>Total Amount</label>
          </div>
        </div>
        <div className="subcard">
          <div className="flex flex-col">
            <p className="text-l ml-5 underline mb-1">Amount</p>

            <div className="flex gap-1">
              <input
                className="w-20 rounded text-black px-1 ml-5"
                type="text"
                id="amount"
                name="amount"
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                }}
              />
              {chosenCoin && <WETH></WETH>}
              {!chosenCoin && <USDC></USDC>}
            </div>
            {isConnected && chosenCoin && wethBalance > 0 && (
              <div>
                <p className="text-xs text-right">MAX : {wethBalance}</p>
                <input
                  className="w-full"
                  type="range"
                  id="amount_range"
                  onChange={(event) => {
                    setAmount((wethBalance * (parseInt(event.target.value) / 100)).toString());
                  }}
                />
              </div>
            )}
            {isConnected && !chosenCoin && usdcBalance && (
              <div>
                <p className="text-xs text-right">MAX : {usdcBalance}</p>
                <input
                  className="w-full"
                  type="range"
                  id="amount_range"
                  onChange={(event) => {
                    setAmount((usdcBalance * (parseInt(event.target.value) / 100)).toString());
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="subcard" onChange={handleFrequency}>
          <p className="text-l ml-5 underline">Frequency</p>
          <div className="flex mx-auto gap-4">
            <div className="flex gap-1">
              <input type="radio" name="frequence" value={"30"} defaultChecked />
              <label>Monthly</label>
            </div>
            <div className="flex gap-1">
              <input type="radio" name="frequence" value={"7"} />
              <label>Weekly</label>
            </div>
            <div className="flex gap-1">
              <input type="radio" name="frequence" id="custom_frequency" value={frequency} />
              Every
              <input
                className="rounded w-10 text-black px-1"
                type="text"
                id="frequency"
                name="frequency"
                onChange={(event) => {
                  setFrequency(event.target.value);
                  const radioBtn = document.getElementById("custom_frequency") as HTMLInputElement;
                  radioBtn.checked = true;
                }}
                value={frequency}
              />
              days
            </div>
          </div>
        </div>

        <div className="subcard" onChange={handleNbOrder}>
          <p className="text-l ml-5 underline">Duration</p>
          <div className="flex mx-auto gap-4">
            <div className="flex gap-1">
              <input type="radio" name="duration" value={7} defaultChecked />
              <label>7</label>
            </div>
            <div className="flex gap-1">
              <input type="radio" name="duration" value={15} />
              <label>15</label>
            </div>
            <div className="flex gap-1">
              <input type="radio" name="duration" value={30} />
              <label>30</label>
            </div>
            <div className="flex gap-1">
              <input type="radio" name="duration" id="custom_duration" value={frequency} />
              <input
                className="rounded w-10 text-black px-1"
                type="text"
                id="duration"
                name="duration"
                onChange={(event) => {
                  setNbOrder(event.target.value);
                  const radioBtn = document.getElementById("custom_duration") as HTMLInputElement;
                  radioBtn.checked = true;
                }}
                value={nbOrder}
              />{" "}
              times
            </div>
          </div>
        </div>

        <div className="subcard">
          <p className="text-l ml-5 underline">Type of order</p>
          <div className="flex gap-1">
            <input
              type="radio"
              name="type"
              value={"0"}
              onClick={() => setPercentage("0")}
              onChange={handleOpenPercent}
              defaultChecked
            />
            <label>Market Price</label>
          </div>
          {!openPercent && <div>Price: 1600 USDC</div>}
          <div className="flex gap-1">
            <input type="radio" name="type" value={"percentage"} onChange={handleOpenPercent} />
            <label>Percentage below market price</label>
          </div>
          {openPercent && (
            <div>
              <div className="flex">
                -
                <input
                  className="rounded w-10 text-black px-1 mr-1 ml-1"
                  type="text"
                  id="percentage"
                  name="percentage"
                  onChange={(event) => {
                    verifPercentage(event);
                  }}
                  value={percentage}
                />
                <div>
                  % Price :{" "}
                  {new Intl.NumberFormat("en-US", { maximumSignificantDigits: 5 }).format(
                    1600 * (1 - parseInt(percentage) / 100)
                  )}
                </div>
              </div>
              <p className="text-xs text-red-400">{errorPercent}</p>
            </div>
          )}
          {/* <div className="flex gap-1">
                        <input type="radio" name="type" value={"fixed"} onClick={() => setType("fixed")} />
                        <label>Fixed Price</label>
                    </div>
                    {type === "fixed" &&
                        <div className="flex">
                            <div>Price:</div>
                            <input
                                className="rounded w-14 text-black px-1 mr-1"
                                type="text"
                                id="price"
                                name="price"
                                onChange={event => {
                                    setPrice(event.target.value)
                                }}
                                value={price}
                            />
                            <p>USDC</p>
                        </div>
                    } */}
        </div>
        {chosenCoin && wethAllowance <= BigNumber.from(0) && (
          <div className="flex w-3/4 m-auto">
            <button
              className="mx-auto py-2 px-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-lg"
              onClick={write_WETH}
            >
              Approve
            </button>
            <div className="mx-auto py-2 px-4 bg-gray-600 rounded-lg">Submit</div>
          </div>
        )}
        {!chosenCoin && usdcAllowance <= BigNumber.from(0) && (
          <div className="flex w-3/4 m-auto">
            <button
              className="mx-auto py-2 px-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-lg"
              onClick={write_USDC}
            >
              Approve
            </button>
            <div className="mx-auto py-2 px-4 bg-gray-600 rounded-lg">Submit</div>
          </div>
        )}

        {chosenCoin && wethAllowance > BigNumber.from(0) && (
          <div className="flex w-3/4 m-auto">
            <div className="mx-auto py-2 px-4 bg-gray-600 rounded-lg">Approve</div>
            <button
              className="mx-auto py-2 px-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-lg"
              onClick={write}
            >
              Submit
            </button>
          </div>
        )}
        {!chosenCoin && usdcAllowance > BigNumber.from(0) && (
          <div className="flex w-3/4 m-auto">
            <div className="mx-auto py-2 px-4 bg-gray-600 rounded-lg">Approve</div>
            <button
              className="mx-auto py-2 px-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-lg"
              onClick={write}
            >
              Submit
            </button>
          </div>
        )}
      </div>

      <div className="my-auto">
        <h1 className="text-3xl text-center mb-7">Preview</h1>
        <div className="text-white border-solid border-2 border-white p-3 rounded-xl m-5 cursor-pointer bg-slate-700 h-min">
          {chosenCoin && (
            <h1 className="text-center text-3xl mb-3 flex">
              <WETH></WETH> <Image src={fleche} alt="fleche icon" height={40} /> <USDC></USDC>
            </h1>
          )}
          {!chosenCoin && (
            <h1 className="text-center text-3xl mb-3 flex">
              <USDC></USDC> <Image src={fleche} alt="fleche icon" height={40} /> <WETH></WETH>
            </h1>
          )}
          <p>Period time : {frequency} days</p>
          {chosenCoin && <p>Amount per period : {periodAmount} WETH</p>}
          {!chosenCoin && <p>Amount per period : {periodAmount} USDC</p>}
          <p>Number of period : {nbOrder}</p>

          {chosenCoin && (
            <p className="text-xl mt-5">
              Total invest :{" "}
              {new Intl.NumberFormat("en-US", { maximumSignificantDigits: 5 }).format(
                parseFloat(periodAmount) * parseFloat(nbOrder)
              )}{" "}
              WETH
            </p>
          )}
          {!chosenCoin && (
            <p className="text-xl mt-5">
              Total invest :{" "}
              {new Intl.NumberFormat("en-US", { maximumSignificantDigits: 5 }).format(
                parseInt(periodAmount) * parseFloat(nbOrder)
              )}{" "}
              USDC
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
