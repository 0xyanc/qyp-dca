import { Dispatch, SetStateAction } from 'react';

function Table({ OpenModalTable, setOpenModalTable}: {OpenModalTable :boolean, setOpenModalTable: Dispatch<SetStateAction<boolean>>}) {

    if (!OpenModalTable) return null;
    return(
        <div className="w-3/4 h-3/4 fixed inset-0 m-auto bg-slate-700 rounded-xl">
            <p className='text-right mr-5 mt-3 cursor-pointer' onClick={() => setOpenModalTable(false)}>X</p>
            <div className='text-center'>
                <h1 className="text-3xl mb-5">Total : +200 $</h1>
                <p>Amount per period : 75$</p>
            </div>
            <div className='h-96 overflow-y-auto w-3/4 m-auto mt-3'>
            <table className="border-solid border-2 border-white w-full m-auto">
                <tr>
                    <th>Date</th>
                    <th>Purchase price</th>
                    <th>Profit / Loss</th>
                    <th>Status</th>
                </tr>
                <tr>
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
                <tr>
                    <td>17/03/2023</td>
                    <td>1700$</td>
                    <td>-50$</td>
                    <td>V</td>
                </tr>
                <tr>
                    <td>18/03/2023</td>
                    <td>1600$</td>
                    <td></td>
                    <td>X</td>
                </tr>
                <tr>
                    <td>19/03/2023</td>
                    <td></td>
                    <td></td>
                    <td>X</td>
                </tr>
                <tr>
                    <td>20/03/2023</td>
                    <td></td>
                    <td></td>
                    <td>X</td>
                </tr>
                <tr>
                    <td>21/03/2023</td>
                    <td></td>
                    <td></td>
                    <td>X</td>
                </tr>
            </table>
            </div>
        </div>
    )
}

export default Table;