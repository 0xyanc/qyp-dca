import { useEffect, useState } from "react"

export const Create = () => {
    const [isTotal, setIsTotal] = useState(false)
    const [amount, setAmount] = useState('0')
    const [nbOrder, setNbOrder] = useState('0')
    const [frequency, setFrequency] = useState('0')
    const [percentage, setPercentage] = useState('0')
    const [type, setType] = useState('')
    const [price, setPrice] = useState('0')

    useEffect(() => {
        console.log(`amount: ${amount}, isTotal: ${isTotal}, nbOrder: ${nbOrder}, frequency:${frequency} nbOrder:${nbOrder} price:${price}`
        )
    }, [amount, isTotal, nbOrder, frequency, percentage, type, price])


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

    return (
        <div className="mx-auto flex font-mono text-white">
            <div className="flex flex-col gap-2 border-2 rounded-lg p-2">
                <div className="subcard">
                    sell USDC for ETH
                </div>
                <div className="flex mx-auto gap-9" onChange={handleTotal}>
                    <div className="flex gap-2">
                        <input type="radio" name="invest" value="true" />
                        <label>Total Investment</label>
                    </div>
                    <div className="flex gap-2">
                        <input type="radio" name="invest" value="false" />
                        <label>Amount per Period</label>
                    </div>
                </div>
                <div className="subcard">
                    <div className="flex flex-col">
                        <p>How much do you want to invest?</p>
                        <div className="flex gap-1">
                            <input
                                className="w-20 rounded text-black px-1"
                                type="text"
                                id="amount"
                                name="amount"
                                onChange={(event) => { setAmount(event.target.value) }}
                            />
                            USDC
                        </div>
                    </div>
                </div>

                <div className="subcard" onChange={handleFrequency}>
                    <p>Which Frequence?</p>
                    <div className="flex mx-auto gap-4">
                        <div className="flex gap-1">
                            <input type="radio" name="frequence" value={'30'} />
                            <label>Monthly</label>
                        </div>
                        <div className="flex gap-1">
                            <input type="radio" name="frequence" value={'7'} />
                            <label>Weekly</label>
                        </div>
                        <div className="flex gap-1">
                            <input type="radio" name="frequence" value={frequency} />
                            Every
                            <input
                                className="rounded w-10 text-black px-1"
                                type="text"
                                id="frequency"
                                name="frequency"
                                onChange={event => { setFrequency(event.target.value) }}
                                value={frequency}
                            />
                            days
                        </div>
                    </div>
                </div>

                <div className="subcard" onChange={handleNbOrder}>
                    <p>How many time?</p>
                    <div className="flex mx-auto gap-4">
                        <div className="flex gap-1">
                            <input type="radio" name="frequence" value={5} />
                            <label>5</label>
                        </div>
                        <div className="flex gap-1">
                            <input type="radio" name="frequence" value={10} />
                            <label>10</label>
                        </div>
                        <div className="flex gap-1">
                            <input type="radio" name="frequence" value={12} />
                            <label>12</label>
                        </div>
                        <div className="flex gap-1">
                            <input type="radio" name="frequence" value={frequency} />
                            <input
                                className="rounded w-10 text-black px-1"
                                type="text"
                                id="frequency"
                                name="frequency"
                                onChange={event => { setNbOrder(event.target.value) }}
                                value={nbOrder}
                            /> times
                        </div>
                    </div>
                </div>

                <div className="subcard">
                    <p>Which type?</p>
                    <div className="flex gap-1">
                        <input type="radio" name="type" value={"market"} onClick={() => setType("market")} />
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
                    <div className="flex gap-1">
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
                    }
                </div>
                <button className="mx-auto py-2 px-4 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 rounded-lg">
                    Submit
                </button>
            </div>
        </div >
    )
}