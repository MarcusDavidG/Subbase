import { useState, useEffect } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { useName } from '@coinbase/onchainkit/identity';
import { ethers } from 'ethers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import SubscriptionManagerABI from '../SubscriptionManager.json';

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

export function Dashboard() {
  const { address, isConnected } = useAccount();
  const { data: name } = useName({ address });
  const { data: walletClient } = useWalletClient();

  const [tokenAddress, setTokenAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getContract = () => {
    if (!walletClient) return null;
    const provider = new ethers.BrowserProvider(walletClient.transport);
    const signer = provider.getSigner(walletClient.account.address);
    return new ethers.Contract(contractAddress, SubscriptionManagerABI.abi, signer);
  };

  const fetchSubscriptions = async () => {
    if (!isConnected || !walletClient) return;
    setLoading(true);
    try {
      const contract = getContract();
      if (!contract) return;
      
      // This is a simplified fetch. A more robust implementation would handle all active subscriptions.
      // For now, we assume the user is the subscriber for all their created subscriptions.
      const subCount = await contract.subscriptionCount();
      const userSubscriptions = [];
      for (let i = 1; i <= subCount; i++) {
        const sub = await contract.subscriptions(i);
        if (sub.subscriber === address && sub.active) {
          userSubscriptions.push({ id: i, ...sub });
        }
      }
      setSubscriptions(userSubscriptions);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [isConnected, walletClient, address]);

  const handleCreateSubscription = async () => {
    if (!tokenAddress || !amount || !recipient) {
      alert('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const contract = getContract();
      if (!contract) return;

      const amountInWei = ethers.parseUnits(amount, 18); // Assuming 18 decimals
      const intervalInSeconds = 30 * 24 * 60 * 60; // 30 days

      const tx = await contract.createSubscription(
        tokenAddress,
        amountInWei,
        intervalInSeconds,
        recipient
      );
      await tx.wait();
      alert(`Subscription created! Tx hash: ${tx.hash}`);
      fetchSubscriptions(); // Refresh list after creation
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert('Failed to create subscription.');
    } finally {
      setLoading(false);
    }
  };

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
                Token Address (e.g., an ERC20)
              </label>
              <Input
                placeholder="0x..."
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <Input
                type="number"
                placeholder="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Address
              </label>
              <Input
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <Button onClick={handleCreateSubscription} disabled={loading} className="w-full">
              {loading ? 'Processing...' : 'Create Subscription'}
            </Button>
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
            {subscriptions.length > 0 ? (
              <ul className="space-y-2">
                {subscriptions.map((sub) => (
                  <li key={sub.id} className="p-2 border rounded-md">
                    <p><strong>To:</strong> {sub.recipient}</p>
                    <p><strong>Amount:</strong> {ethers.formatUnits(sub.amount, 18)}</p>
                    <p><strong>Token:</strong> {sub.token}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No active subscriptions yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
