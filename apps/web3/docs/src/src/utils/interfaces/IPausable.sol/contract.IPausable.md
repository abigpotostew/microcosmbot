# IPausable
[Git Source](https://github.com/daokitchen/nouns-stream/blob/c3b52a7ea0bf77a05c09aab9730867448a5dfdc7/src/utils/interfaces/IPausable.sol)


## Functions
### paused

If the contract is paused


```solidity
function paused() external view returns (bool);
```

### pause

Pauses the contract


```solidity
function pause() external;
```

## Events
### Paused
Emitted when the contract is paused


```solidity
event Paused(address user);
```

### Unpaused
Emitted when the contract is unpaused


```solidity
event Unpaused(address user);
```

## Errors
### PAUSED
*Reverts if called when the contract is paused*


```solidity
error PAUSED();
```

### UNPAUSED
*Reverts if called when the contract is unpaused*


```solidity
error UNPAUSED();
```

