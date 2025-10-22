# Relayer

This folder contains the relayer service for the SubBase dApp, built with Node.js and TypeScript. It periodically checks for due subscriptions and executes payments on behalf of users using smart wallets.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your relayer private key, RPC URL, and contract address.

4. Run the relayer:
   ```bash
   npm start
