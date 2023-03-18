import { ConnectButton } from '@rainbow-me/rainbowkit';


import Image from 'next/image';
import ODCA_name from '../../public/ODCA_name.png'
import ODCA_logo from '../../public/ODCA_logo.png'

export const Header = () => {
    return (
        <>
            <div className="flex font-mono text-white mt-3 ml-5 text-5xl">
                <Image src={ODCA_logo} alt="logo ODCA" height={50} className="mr-2"/>
                <Image src={ODCA_name} alt="logo ODCA" height={50}/>
            </div>
            <div className="absolute top-2 right-2">
                <ConnectButton />
            </div>
        </>
    )
}
