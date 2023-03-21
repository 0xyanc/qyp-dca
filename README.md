# On Chain Dollar Cost Average

Project for Paris Blockchain Week Hackathon 2023 in Gridex track : https://www.gdx.org/

## Deployment
https://qyp-dca.vercel.app/
| Network          | Address                                    |
| ---------------- | ------------------------------------------ |
| Arbitrum Mainnet | 0x4F49dc13C90fc023Bc19ba1d972630C0D53b8340 |  |

https://arbiscan.io/address/0x4f49dc13c90fc023bc19ba1d972630c0d53b8340

## Building ODCA
##### Clone the project
Clone the repository on your local machine
```bash
$ git clone https://github.com/0xyanc/qyp-dca.git
```

### Front End ###
We use NextJS13 as framework of React. The Front End scripts are in "client" folder.
We use RainbowKit for wallet management and wagmi as React library for interacting with smart contracts
If you want to launch the Front End locally:

1. Go to "client" folder
```bash
$ cd client
```

2. Install the dependencies
```bash
$ npm install
```

3. Launch the server locally
```bash
$ npm run dev
```

4. Open your browser and go to `http://localhost:3000`
The backend server must be launched to display and interact with the catalog
Please follow next section for installing and deploying backend server

- The address of the smart contract used by the Front End is in /client/app/components/Coin/addresses.ts
- The chain configuration is in /client/app/page.tsx. Only Arbitrum mainnet is used   

### Core Contracts ###
We use Hardhat for contract development

We use Gelato to automate our transactions https://app.gelato.network/
Every day we call the function dailyOrderSubmission() from our smart contract to submit orders that are meeting the frequency criteria

1. Go to "backend" folder
```bash
$ cd backend
```

2. Install the dependencies
```bash
$ npm install
```

3. The contrat is available in "contracts" folder

4. We use .env for environment variables. Change the name of env.example to .env and fill in the 4 variables :
- PK: Key used to deploy smart contracts
- ARBISCAN: Key to verify contract on Arbitrum Explorer
- ETHERSCAN: Key used to verify contract on Etherscan
- ALCHEMY_ARBI_GOERLI: Alchemy Key for Goerli
- ALCHEMY_ARBI_MAINNET: Alchemy key for Arbitrum mainnet

### Contact ###
- Solidity: https://www.linkedin.com/in/yannick-chi
- Front End: https://www.linkedin.com/in/quentin-denolle-6542a3160/
- Full-Stack: https://www.linkedin.com/in/grandne/
