import Image from 'next/image';
import usd_coin_logo from '../../../public/usd-coin-usdc-logo.svg'

function Coin_usdc() {
    return (
        <div className="flex mr-5"><Image src={usd_coin_logo} alt="usd coin logo" height={20} className="ml-4 mr-2"/> USDC</div>
    )
}

export default Coin_usdc;