import Image from 'next/image';
import ethereum_logo from '../../../public/ethereum-eth-logo.svg'

function Coin_weth() {
    return (
        <div className="flex mr-5"><Image src={ethereum_logo} alt="ethereum logo" height={20} className="ml-4 mr-2"/> WETH</div>
    )
}

export default Coin_weth;