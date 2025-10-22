# Contracts

This folder contains the smart contracts for the SubBase dApp, built with Hardhat and TypeScript. It includes the SubscriptionManager.sol contract for managing ERC-20 token-based subscriptions on the Base Sepolia testnet.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your private key and RPC URL.

4. Compile contracts:
   ```bash
   npx hardhat compile
   ```

5. Run tests:
   ```bash
   npx hardhat test
   ```

6. Deploy to Base Sepolia:
   ```bash
   npx hardhat run scripts/deploy.ts --network base-sepolia
