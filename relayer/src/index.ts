import { ethers } from 'ethers';
import * as cron from 'node-cron';
import * as dotenv from 'dotenv';

dotenv.config();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
const RPC_URL = process.env.RPC_URL || 'https://sepolia.base.org';
const PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY!;

const SUBSCRIPTION_MANAGER_ABI = [
  "function getActiveSubscriptions() view returns (uint256[])",
  "function subscriptions(uint256) view returns (address subscriber, address token, uint256 amount, uint256 interval, address recipient, uint256 nextPayment, bool active)",
  "function executeSubscriptionPayment(uint256 subscriptionId) external"
];

async function main() {
  console.log('Starting SubBase Relayer...');

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, SUBSCRIPTION_MANAGER_ABI, wallet);

  console.log(`Connected to contract at ${CONTRACT_ADDRESS}`);
  console.log(`Relayer address: ${wallet.address}`);

  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      console.log('Checking for due subscriptions...');

      const activeSubscriptions = await contract.getActiveSubscriptions();

      for (const subscriptionId of activeSubscriptions) {
        const subscription = await contract.subscriptions(subscriptionId);

        if (subscription.active && subscription.nextPayment <= Math.floor(Date.now() / 1000)) {
          console.log(`Executing payment for subscription ${subscriptionId}`);

          try {
            const tx = await contract.executeSubscriptionPayment(subscriptionId);
            await tx.wait();
            console.log(`Payment executed. Transaction hash: ${tx.hash}`);
          } catch (error) {
            console.error(`Failed to execute payment for subscription ${subscriptionId}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Error checking subscriptions:', error);
    }
  });

  console.log('Relayer is running...');
}

main().catch((error) => {
  console.error('Relayer failed to start:', error);
  process.exit(1);
});
