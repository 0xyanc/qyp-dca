import { useEffect, useState } from "react"

export const Create = () => {
    const [isTotal, setIsTotal] = useState(false)
    const [amount, setAmount] = useState(0)
    const [nbOrder, setNbOrder] = useState(0)
    const [frequency, setFrequency] = useState('0')

    useEffect(() => {
        console.log(`amount: ${amount}, isTotal: ${isTotal}, nbOrder: ${nbOrder}, frequency:${frequency}`
        )
    }, [amount, isTotal, nbOrder, frequency])


    const handleFrequency = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFrequency(event.target.value)
    }

    const handleTotal = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isTrue = (event.target.value === 'true');
        setIsTotal(isTrue)
    }


    const handleAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(amount)
        const updatedAmount = parseInt(event.target.value)
        setAmount(updatedAmount)
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
                                onChange={handleAmount}
                            />
                            USDC
                        </div>
                    </div>
                </div>

                <div className="subcard" onChange={handleFrequency}>
                    <p>Which Frequence?</p>
                    <div className="flex mx-auto gap-4">
                        <div className="flex gap-1">
                            <input type="radio" name="frequence" value={30} />
                            <label>Montly</label>
                        </div>
                        <div className="flex gap-1">
                            <input type="radio" name="frequence" value={7} />
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
                <div className="subcard">
                    <p>Which type?</p>
                    <div className="flex gap-1">
                        <input type="radio" name="type" />
                        <label>Market Price</label>
                    </div>
                    <div className="flex gap-1">
                        <input type="radio" name="type" />
                        <label>Percentage below market price</label>
                    </div>
                    <div className="flex gap-1">
                        <input type="radio" name="type" />
                        <label>Fixed Price</label>
                    </div>
                </div>
                <button className="mx-auto py-2 px-4 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 rounded-lg">
                    Submit
                </button>
            </div>
        </div>
    )
}