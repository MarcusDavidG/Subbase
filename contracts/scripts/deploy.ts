import { ethers } from "hardhat";
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  console.log("Deploying SubscriptionManager...");

  const SubscriptionManager = await ethers.getContractFactory("SubscriptionManager");
  const subscriptionManager = await SubscriptionManager.deploy();

  await subscriptionManager.waitForDeployment();

  const address = await subscriptionManager.getAddress();
  console.log(`SubscriptionManager deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
