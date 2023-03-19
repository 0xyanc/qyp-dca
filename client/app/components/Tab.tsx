import { Dispatch, SetStateAction } from 'react';

export const Tab = ({ create, setCreate }:
    {
        create: boolean
        setCreate: Dispatch<SetStateAction<boolean>>
    }) => {

    return (
        <div className="mx-auto mt-10 mb-4 rounded">
            <ul id="tabs" className="inline-flex w-full px-1 pt-2 ">
                <li
                    className={create ? "active-tab" : "non-active-tab"}
                    onClick={() => setCreate(true)}
                > Create DCA</li>
                <li
                    className={!create ? "active-tab" : "non-active-tab"}
                    onClick={() => setCreate(false)}
                >See Positions</li>
            </ul>
        </div >
    )
}
