import { useAccount } from 'wagmi'
import { useName } from '@coinbase/onchainkit/identity'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'

export function Dashboard() {
  const { address } = useAccount()
  const { data: name } = useName({ address })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Address: {address} {name && `(${name})`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Subscription</CardTitle>
            <CardDescription>
              Set up a new recurring payment subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Token Address
              </label>
              <Input placeholder="0x..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <Input type="number" placeholder="0.01" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interval
              </label>
              <Input placeholder="monthly" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Address
              </label>
              <Input placeholder="0x..." />
            </div>
            <Button className="w-full">Create Subscription</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Subscriptions</CardTitle>
            <CardDescription>
              Manage your active subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-8">
              No active subscriptions yet
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
