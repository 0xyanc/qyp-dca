export const Position = () => {
    return (
        <div className="inline mt-20 w-3/4 m-auto">
            <h1 className="text-center text-white text-5xl">Position</h1>
            <div className="flex flex-wrap">
                <div className="text-white border-solid border-black border-2 border-white p-3 rounded-xl m-10 w-64">
                    <h1 className="text-center text-3xl mb-3">USDT --{'>'} ETH</h1>
                    <p>Period time : 1 month</p>
                    <p>Amount per period : 100$</p>
                    <p>Number of period : 12</p>
                    <div className="mt-5 bg-black h-2.5"><div className="w-5/12 bg-white h-2.5"> </div></div>
                </div> 
                <div className="text-white border-solid border-black border-2 border-white p-3 rounded-xl m-10 w-64">
                    <h1 className="text-center text-3xl mb-3">USDT --{'>'} GDX</h1>
                    <p>Period time : 10 days</p>
                    <p>Amount per period : 150$</p>
                    <p>Number of period : 5</p>
                    <div className="mt-5 bg-black h-2.5"><div className="w-8/12 bg-white h-2.5"> </div></div>
                </div>
                <div className="text-white border-solid border-black border-2 border-white p-3 rounded-xl m-10 w-64">
                    <h1 className="text-center text-3xl mb-3">GDX --{'>'} ETH</h1>
                    <p>Period time : 1 week</p>
                    <p>Amount per period : 75$</p>
                    <p>Number of period : 24</p>
                    <div className="mt-5 bg-black h-2.5"><div className="w-12/12 bg-white h-2.5"> </div></div>
                </div>
            </div>
        </div>
    )
}