import { expect } from "chai";
import { ethers } from "hardhat";
import { SubscriptionManager } from "../typechain-types";

describe("SubscriptionManager", function () {
  let subscriptionManager: SubscriptionManager;
  let owner: any;
  let subscriber: any;
  let recipient: any;
  let token: any;

  beforeEach(async function () {
    [owner, subscriber, recipient] = await ethers.getSigners();

    // Deploy a mock ERC20 token for testing
    const MockToken = await ethers.getContractFactory("MockERC20");
    token = await MockToken.deploy("Mock Token", "MOCK", ethers.parseEther("1000"));
    await token.waitForDeployment();

    const SubscriptionManager = await ethers.getContractFactory("SubscriptionManager");
    subscriptionManager = await SubscriptionManager.deploy();
    await subscriptionManager.waitForDeployment();
  });

  describe("createSubscription", function () {
    it("Should create a subscription", async function () {
      const amount = ethers.parseEther("1");
      const interval = 30 * 24 * 60 * 60; // 30 days

      await expect(
        subscriptionManager.connect(subscriber).createSubscription(
          await token.getAddress(),
          amount,
          interval,
          recipient.address
        )
      ).to.emit(subscriptionManager, "SubscriptionCreated");

      const subscription = await subscriptionManager.subscriptions(1);
      expect(subscription.subscriber).to.equal(subscriber.address);
      expect(subscription.token).to.equal(await token.getAddress());
      expect(subscription.amount).to.equal(amount);
      expect(subscription.interval).to.equal(interval);
      expect(subscription.recipient).to.equal(recipient.address);
      expect(subscription.active).to.equal(true);
    });
  });
});
