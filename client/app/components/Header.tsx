import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Dispatch, SetStateAction } from 'react';

export const Header = ({ create, setCreate }: {
    create: boolean
    setCreate: Dispatch<SetStateAction<boolean>>
}) => {
    return (
        <>
            <div className="absolute top-2 left-2 font-mono text-white text-5xl">ODCA</div>
            <button className="absolute top-2 my-auto" onClick={() => setCreate(!create)}>change tab</button>
            <div className="absolute top-2 right-2">
                <ConnectButton />
            </div>
        </>
    )
}
