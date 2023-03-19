import { useEffect, useState } from "react"

import Image from 'next/image';
import change_icon from '../../public/change.png'
import fleche from '../../public/fleche.png'

import USDC from './Coin/usdc'
import WETH from './Coin/weth'

export const Create = () => {
    const [isTotal, setIsTotal] = useState(false)
    const [amount, setAmount] = useState('0')
    const [periodAmount, setPeriodAmount] = useState('0')
    const [nbOrder, setNbOrder] = useState('7')
    const [frequency, setFrequency] = useState('30')
    const [percentage, setPercentage] = useState('0')
    const [type, setType] = useState('market')
    const [price, setPrice] = useState('0')
    const [chosenCoin, setChosenCoin] = useState(true);

    useEffect(() => {
        console.log(`periodAmount: ${periodAmount}, isTotal: ${isTotal}, nbOrder: ${nbOrder}, frequency:${frequency} nbOrder:${nbOrder} price:${price}`)
    }, [amount, isTotal, nbOrder, frequency, percentage, type, price])

    useEffect(() => {
        calculAmount();
    }, [amount, isTotal, nbOrder])


    const handleFrequency = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFrequency(event.target.value)
    }

    const handleTotal = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isTrue = (event.target.value === 'true');
        setIsTotal(isTrue)
    }

    const handleNbOrder = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNbOrder(event.target.value)
    }

    const handleType = (event: React.ChangeEvent<HTMLInputElement>) => {
        setType(event.target.value)
    }

    function calculAmount(){
        if(isTotal){
            setPeriodAmount(new Intl.NumberFormat('en-US', { maximumSignificantDigits: 5 }).format((parseFloat(amount) / parseInt(nbOrder))));
        }
        else{
            setPeriodAmount(new Intl.NumberFormat('en-US', { maximumSignificantDigits: 5 }).format(parseFloat(amount)));
        }
    }

    return (
        <div className="flex mt-5 m-auto pb-16 font-mono text-white justify-around w-3/4">
            <div className="flex flex-col gap-2 border-2 rounded-lg p-2">
                {chosenCoin &&
                    <div className="subcard flex flex-row">
                        Buy 
                        <USDC></USDC>
                        with
                        <WETH></WETH>
                        <p onClick={() => setChosenCoin(!chosenCoin)} className="cursor-pointer"><Image src={change_icon} alt="change icon" height={20} className="ml-8"/></p>
                    </div>
                }
                {!chosenCoin &&
                    <div className="subcard flex flex-row">
                        Buy 
                        <WETH></WETH>
                        with
                        <USDC></USDC>
                        <p onClick={() => setChosenCoin(!chosenCoin)} className="cursor-pointer"><Image src={change_icon} alt="change icon" height={20} className="ml-8"/></p>
                    </div>
                }
                <div className="flex mx-auto gap-9" onChange={handleTotal}>
                    <div className="flex gap-2">
                        <input type="radio" name="invest" value="false" checked={isTotal === false}/>
                        <label>Amount per Period</label>
                    </div>
                    <div className="flex gap-2">
                        <input type="radio" name="invest" value="true"/>
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
                                onChange={(event) => { setAmount(event.target.value) }}
                            />
                            {chosenCoin && <WETH></WETH>}
                            {!chosenCoin && <USDC></USDC>}
                        </div>
                    </div>
                </div>

                <div className="subcard" onChange={handleFrequency}>
                    <p className="text-l ml-5 underline">Frequency</p>
                    <div className="flex mx-auto gap-4">
                        <div className="flex gap-1">
                            <input type="radio" name="frequence" value={'30'}  checked={frequency === '30'}/>
                            <label>Monthly</label>
                        </div>
                        <div className="flex gap-1">
                            <input type="radio" name="frequence" value={'7'} />
                            <label>Weekly</label>
                        </div>
                        <div className="flex gap-1">
                            <input type="radio" name="frequence" id="custom_frequency" value={frequency}/>
                            Every
                            <input
                                className="rounded w-10 text-black px-1"
                                type="text"
                                id="frequency"
                                name="frequency"
                                onChange={event => { 
                                    setFrequency(event.target.value); 
                                    const radioBtn = document.getElementById("custom_frequency") as HTMLInputElement;
                                    radioBtn.checked = true;}}
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
                            <input type="radio" name="duration" value={7}  checked={nbOrder === '7'}/>
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
                                onChange={event => { 
                                    setNbOrder(event.target.value);
                                    const radioBtn = document.getElementById("custom_duration") as HTMLInputElement;
                                    radioBtn.checked = true; }}
                                value={nbOrder}
                            /> times
                        </div>
                    </div>
                </div>

                <div className="subcard">
                    <p className="text-l ml-5 underline">Type of order</p>
                    <div className="flex gap-1">
                        <input type="radio" name="type" value={"market"} onClick={() => setType("market")} checked={type === 'market'}/>
                        <label>Market Price</label>
                    </div>
                    {type === "market" &&
                        <div>Price: 1600 USDC</div>
                    }
                    <div className="flex gap-1">
                        <input type="radio" name="type" value={"percentage"} onClick={() => setType("percentage")} />
                        <label>Percentage below market price</label>
                    </div>
                    {type === "percentage" &&
                        <div className="flex">
                            <input
                                className="rounded w-10 text-black px-1 mr-1"
                                type="text"
                                id="percentage"
                                name="percentage"
                                onChange={event => {
                                    setPercentage(event.target.value)
                                }}
                                value={percentage}
                            />
                            <div>%  Price : {1600 * (1 - (parseInt(percentage) / 100))}</div>
                        </div>
                    }
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
                <button className="mx-auto py-2 px-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-lg">
                    Submit
                </button>
            </div>

            <div className="my-auto">
                <h1 className="text-3xl text-center mb-7">Preview</h1>
                <div className="text-white border-solid border-2 border-white p-3 rounded-xl m-5 cursor-pointer bg-slate-700 h-min">
                    {chosenCoin &&
                        <h1 className="text-center text-3xl mb-3 flex"><WETH></WETH> <Image src={fleche} alt="fleche icon" height={40}/> <USDC></USDC></h1>
                    }
                    {!chosenCoin &&
                        <h1 className="text-center text-3xl mb-3 flex"><USDC></USDC> <Image src={fleche} alt="fleche icon" height={40}/> <WETH></WETH></h1>
                    }
                    <p>Period time : {frequency} days</p>
                    {chosenCoin && <p>Amount per period : {periodAmount} WETH</p>}
                    {!chosenCoin && <p>Amount per period : {periodAmount} USDC</p>}
                    <p>Number of period : {nbOrder}</p>
                </div>
            </div>
        </div >
    )
}