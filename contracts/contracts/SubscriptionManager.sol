// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SubscriptionManager is Ownable {
    struct Subscription {
        address subscriber;
        address token;
        uint256 amount;
        uint256 interval; // in seconds
        address recipient;
        uint256 nextPayment;
        bool active;
    }

    mapping(uint256 => Subscription) public subscriptions;
    uint256 public subscriptionCount;

    event SubscriptionCreated(uint256 indexed subscriptionId, address indexed subscriber, address indexed recipient);
    event PaymentExecuted(uint256 indexed subscriptionId, uint256 amount);
    event SubscriptionCancelled(uint256 indexed subscriptionId);

    constructor() Ownable(msg.sender) {}

    function createSubscription(
        address _token,
        uint256 _amount,
        uint256 _interval,
        address _recipient
    ) external returns (uint256) {
        require(_token != address(0), "Invalid token address");
        require(_amount > 0, "Amount must be greater than 0");
        require(_interval > 0, "Interval must be greater than 0");
        require(_recipient != address(0), "Invalid recipient address");

        subscriptionCount++;
        subscriptions[subscriptionCount] = Subscription({
            subscriber: msg.sender,
            token: _token,
            amount: _amount,
            interval: _interval,
            recipient: _recipient,
            nextPayment: block.timestamp + _interval,
            active: true
        });

        emit SubscriptionCreated(subscriptionCount, msg.sender, _recipient);
        return subscriptionCount;
    }

    function executeSubscriptionPayment(uint256 _subscriptionId) external {
        Subscription storage sub = subscriptions[_subscriptionId];
        require(sub.active, "Subscription is not active");
        require(sub.subscriber == msg.sender || owner() == msg.sender, "Not authorized");
        require(block.timestamp >= sub.nextPayment, "Payment not due yet");

        IERC20 token = IERC20(sub.token);
        require(token.transferFrom(sub.subscriber, sub.recipient, sub.amount), "Transfer failed");

        sub.nextPayment = block.timestamp + sub.interval;

        emit PaymentExecuted(_subscriptionId, sub.amount);
    }

    function cancelSubscription(uint256 _subscriptionId) external {
        Subscription storage sub = subscriptions[_subscriptionId];
        require(sub.active, "Subscription is not active");
        require(sub.subscriber == msg.sender || owner() == msg.sender, "Not authorized");

        sub.active = false;

        emit SubscriptionCancelled(_subscriptionId);
    }

    function getSubscription(uint256 _subscriptionId) external view returns (Subscription memory) {
        return subscriptions[_subscriptionId];
    }

    function getActiveSubscriptions() external view returns (uint256[] memory) {
        uint256[] memory activeSubs = new uint256[](subscriptionCount);
        uint256 count = 0;
        for (uint256 i = 1; i <= subscriptionCount; i++) {
            if (subscriptions[i].active) {
                activeSubs[count] = i;
                count++;
            }
        }
        // Resize array to actual count
        assembly {
            mstore(activeSubs, count)
        }
        return activeSubs;
    }
}
