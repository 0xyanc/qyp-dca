import { Dispatch, SetStateAction } from 'react';

function Table({ OpenModalTable, setOpenModalTable}: {OpenModalTable :boolean, setOpenModalTable: Dispatch<SetStateAction<boolean>>}) {

    if (!OpenModalTable) return null;
    return(
        <div className="w-3/4 h-3/4 fixed inset-0 m-auto bg-black">
            <p className='text-right mr-5 mt-3' onClick={() => setOpenModalTable(false)}>X</p>
            <h1 className="text-center text-3xl">Total : + 200 $</h1>
            <table className="border-solid border-black border-2 border-white">
                <tr>
                    <th>Date</th>
                    <th>Prix d'achat</th>
                    <th>Plus-value</th>
                    <th>État</th>
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
    )
}

export default Table;