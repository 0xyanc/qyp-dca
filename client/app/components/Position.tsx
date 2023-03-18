import { useState } from 'react';

import Table from './Modal/Table';

export const Position = () => {
    const [OpenModalTable, setOpenModalTable] = useState(false);
    const [position, setPosition] = useState(false);

    function toggleTable(){
        setOpenModalTable(!OpenModalTable);
    }

    return (
        <div className="inline mt-5 w-10/12 m-auto overflow-auto pb-16">
            {position &&
                <div className="flex flex-wrap h-full overflow-auto">
                <div className="text-white border-solid border-2 border-white p-3 rounded-xl m-5 w-64 cursor-pointer hover:bg-slate-700" onClick={toggleTable}>
                    <h1 className="text-center text-3xl mb-3">USDT --{'>'} ETH</h1>
                    <p>Period time : 1 month</p>
                    <p>Amount per period : 100$</p>
                    <p>Number of period : 12</p>
                    <div className="mt-5 bg-black h-2.5"><div className="w-5/12 bg-white h-2.5"> </div></div>
                    <Table OpenModalTable={OpenModalTable} setOpenModalTable={setOpenModalTable} />
                </div>
                <div className="text-white border-solid border-2 border-white p-3 rounded-xl m-5 w-64 cursor-pointer hover:bg-slate-700" onClick={toggleTable}>
                    <h1 className="text-center text-3xl mb-3">USDT --{'>'} GDX</h1>
                    <p>Period time : 10 days</p>
                    <p>Amount per period : 150$</p>
                    <p>Number of period : 5</p>
                    <div className="mt-5 bg-black h-2.5"><div className="w-8/12 bg-white h-2.5"> </div></div>
                </div>
                <div className="text-white border-solid border-2 border-white p-3 rounded-xl m-5 w-64 cursor-pointer hover:bg-slate-700" onClick={toggleTable}>
                    <h1 className="text-center text-3xl mb-3">GDX --{'>'} ETH</h1>
                    <p>Period time : 1 week</p>
                    <p>Amount per period : 75$</p>
                    <p>Number of period : 24</p>
                    <div className="mt-5 bg-black h-2.5"><div className="w-12/12 bg-white h-2.5"> </div></div>
                </div>
            </div>
            }
            {!position &&
              <div className='mt-10 text-center'>
                <p className='text-3xl'>Aucun DCA</p>
                <a className='text-xl'>Commencez par un créer un</a>
            </div>
            }
        </div>
    )
}