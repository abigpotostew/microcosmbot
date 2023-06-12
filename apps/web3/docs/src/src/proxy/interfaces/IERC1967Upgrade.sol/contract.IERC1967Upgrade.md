# IERC1967Upgrade
[Git Source](https://github.com/daokitchen/nouns-stream/blob/c3b52a7ea0bf77a05c09aab9730867448a5dfdc7/src/proxy/interfaces/IERC1967Upgrade.sol)

Modified from OpenZeppelin Contracts v4.7.3 (proxy/ERC1967/ERC1967Upgrade.sol)
- Uses custom errors declared in IERC1967Upgrade
- Removes ERC1967 admin and beacon support


## Events
### Upgraded
Emitted when the implementation is upgraded


```solidity
event Upgraded(address impl);
```

## Errors
### INVALID_UPGRADE
*Reverts if an implementation is an invalid upgrade*


```solidity
error INVALID_UPGRADE(address impl);
```

### UNSUPPORTED_UUID
*Reverts if an implementation upgrade is not stored at the storage slot of the original*


```solidity
error UNSUPPORTED_UUID();
```

### ONLY_UUPS
*Reverts if an implementation does not support ERC1822 proxiableUUID()*


```solidity
error ONLY_UUPS();
```

