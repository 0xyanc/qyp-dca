export const Create = () => {
    return (
        <>
            <div className="my-auto flex font-mono text-white text-5xl">
                <div className="flex flex-col gap-2 border-4 rounded-lg p-2">
                    <div className="border-4 rounded-lg">SELL USDC RECEIVE  ETH</div>
                    <div className="border-4 rounded-lg flex">HOW MUCH
                        total invest / amount per period
                    </div>
                    <div className="border-4 rounded-lg">FREQUENCE</div>
                    <div className="border-4 rounded-lg flex flex-col">CHOOSE OFFER
                        <div>Market Price</div>
                        <div>Percentage below market price</div>
                        <div>Fixed Price</div>
                    </div>
                    <button>Submit</button>
                </div>


            </div>

        </>
    )
}