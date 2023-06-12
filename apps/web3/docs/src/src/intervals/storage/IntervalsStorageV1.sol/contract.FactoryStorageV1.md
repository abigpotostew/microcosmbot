# FactoryStorageV1
[Git Source](https://github.com/daokitchen/nouns-stream/blob/c3b52a7ea0bf77a05c09aab9730867448a5dfdc7/src/intervals/storage/IntervalsStorageV1.sol)


## State Variables
### isUpgrade
If a contract has been registered as an upgrade

*Base impl => Upgrade impl*


```solidity
mapping(address => mapping(address => bool)) internal isUpgrade;
```


