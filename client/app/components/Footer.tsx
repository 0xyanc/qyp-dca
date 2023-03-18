import Image from 'next/image';
import logo_github from '../../public/github-white.svg'

export const Footer = () => {
    return (
        <div>
            <div className="absolute bottom-3 left-5 font-mono text-white">by QYP</div>
            <div className="absolute bottom-5 right-5 font-mono text-white"><a href="https://github.com/0xyanc/qyp-dca" target="_blank" className="cursor-pointer"><Image src={logo_github} alt="logo github"/></a></div>
        </div>
    )
}