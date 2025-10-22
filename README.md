# SubBase

SubBase is a decentralized subscription payments dApp built on the Base Sepolia testnet using the OnchainKit stack. It enables on-chain subscription payments through smart wallets and account abstraction, with a relayer service handling recurring payments.

## Project Structure

- [frontend/](./frontend/) - React frontend with OnchainKit integration for wallet connections and UI
- [contracts/](./contracts/) - Hardhat project with SubscriptionManager.sol smart contract
- [relayer/](./relayer/) - Node.js service for executing subscription payments

## Getting Started

1. Clone the repository
2. Follow setup instructions in each subfolder's README
3. Deploy contracts to Base Sepolia
4. Update environment files with contract address
5. Get testnet funds from [Coinbase Developer Platform Faucet](https://portal.cdp.coinbase.com/products/faucet)
6. Run the frontend and relayer services

For detailed instructions, see the README files in each subfolder.
