import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Header = () => {
    return (
        <>
            <div className="flex font-mono text-white text-5xl">ODCA</div>
            <div className="absolute top-2 right-2">
                <ConnectButton />
            </div>
        </>
    )
}
