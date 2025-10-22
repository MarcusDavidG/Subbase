# Frontend

This folder contains the frontend application for the SubBase dApp, built with Vite, React, TypeScript, Tailwind CSS, and shadcn/ui. It integrates OnchainKit for Base blockchain interactions, including wallet connections and Base Name resolution.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your configuration (e.g., RPC URL and OnchainKit API key).

4. Run the development server:
   ```bash
   npm run dev
   ```

## Features

- Wallet connection using OnchainKit
- Display user address and Base Name
- Create subscription form
- List existing subscriptions

## Environment Variables

- `VITE_BASE_RPC_URL`: Base Sepolia RPC URL (default: https://sepolia.base.org)
- `VITE_ONCHAINKIT_API_KEY`: Your OnchainKit API key
