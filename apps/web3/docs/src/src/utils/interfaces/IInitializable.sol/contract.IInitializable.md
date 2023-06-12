# IInitializable
[Git Source](https://github.com/daokitchen/nouns-stream/blob/c3b52a7ea0bf77a05c09aab9730867448a5dfdc7/src/utils/interfaces/IInitializable.sol)


## Events
### Initialized
Emitted when the contract has been initialized or reinitialized


```solidity
event Initialized(uint256 version);
```

## Errors
### ADDRESS_ZERO
*Reverts if incorrectly initialized with address(0)*


```solidity
error ADDRESS_ZERO();
```

### INITIALIZING
*Reverts if disabling initializers during initialization*


```solidity
error INITIALIZING();
```

### NOT_INITIALIZING
*Reverts if calling an initialization function outside of initialization*


```solidity
error NOT_INITIALIZING();
```

### ALREADY_INITIALIZED
*Reverts if reinitializing incorrectly*


```solidity
error ALREADY_INITIALIZED();
```

