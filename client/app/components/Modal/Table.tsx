import { Dispatch, SetStateAction } from 'react';

import Image from 'next/image';
import fleche from '../../../public/fleche.png'
import { dataShowDcaInfo } from './dummydata'
import USDC from './../Coin/usdc'
import WETH from './../Coin/weth'

function Table({ OpenModalTable, setOpenModalTable }: { OpenModalTable: boolean, setOpenModalTable: Dispatch<SetStateAction<boolean>> }) {

    if (!OpenModalTable) return null;
    return (
        <div className="w-3/4 h-3/4 fixed inset-0 m-auto bg-slate-700 rounded-xl">
            <p className='text-right mr-5 mt-3 cursor-pointer' onClick={() => setOpenModalTable(false)}>X</p>
            <div className='text-center'>
                <h1 className="text-3xl mb-5">Total : +200 $</h1>
                <h2 className="flex justify-center text-xl mb-1"><USDC></USDC> <Image src={fleche} alt="fleche icon" height={20} /> <WETH></WETH></h2>
                <p>Amount per period : 75$</p>
            </div>
            <div className='h-96 overflow-y-auto w-3/4 m-auto mt-3'>
                <table className="border-solid border-2 border-white w-full m-auto mb-2">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Purchase price</th>
                            <th>Profit / Loss</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        < tr>
                            <td>15/03/2023</td>
                            <td>1500$</td>
                            <td>+200$</td>
                            <td>V</td>
                        </tr>
                        <tr>
                            <td>16/03/2023</td>
                            <td>1650$</td>
                            <td>+50$</td>
                            <td>V</td>
                        </tr>
                    </tbody>
                </table>
                <table className="border-solid border-2 border-white w-full m-auto">
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
                            const submissionDate = new Date(1679220297 * 1000)
                            const readableDate = submissionDate.toLocaleString().substring(0, 9)
                            return (
                                < tr key={order.orderId}>
                                    <td>{order.orderId}</td>
                                    <td>{readableDate}</td>
                                    <td>{order.price}$</td>
                                    <td>{order.makerAmountTotal}</td>
                                    <td>{order.makerAmountRemaining}</td>
                                </tr>
                            )
                        }
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    )
}

export default Table;