import { useState } from 'react'
import { OnchainKitProvider } from '@coinbase/onchainkit'
import { baseSepolia } from 'wagmi/chains'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { ConnectWallet } from './components/ConnectWallet'
import { Dashboard } from './components/Dashboard'

const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(import.meta.env.VITE_BASE_RPC_URL || 'https://base-sepolia.blockscout.com/'),
  },
})

function App() {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <WagmiProvider config={config}>
      <OnchainKitProvider
        apiKey={import.meta.env.VITE_ONCHAINKIT_API_KEY}
        chain={baseSepolia}
      >
        <div className="min-h-screen bg-gray-50">
          {!isConnected ? (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">SubBase</h1>
                <p className="text-lg text-gray-600 mb-8">
                  Decentralized subscription payments on Base
                </p>
                <ConnectWallet onConnect={() => setIsConnected(true)} />
              </div>
            </div>
          ) : (
            <Dashboard />
          )}
        </div>
      </OnchainKitProvider>
    </WagmiProvider>
  )
}

export default App
