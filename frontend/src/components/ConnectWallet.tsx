import { useEffect } from 'react'
import { useAccount, useConnect } from 'wagmi'
import { Button } from './ui/button'

interface ConnectWalletProps {
  onConnect: () => void
}

export function ConnectWallet({ onConnect }: ConnectWalletProps) {
  const { address, isConnected } = useAccount()
  const { connectors, connect } = useConnect()

  useEffect(() => {
    if (isConnected && address) {
      onConnect()
    }
  }, [isConnected, address, onConnect])

  if (isConnected && address) {
    return null
  }

  return (
    <div className="space-y-4">
      {connectors.map((connector) => (
        <Button
          key={connector.uid}
          onClick={() => connect({ connector })}
          className="w-full"
        >
          Connect {connector.name}
        </Button>
      ))}
    </div>
  )
}
