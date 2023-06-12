# IOwnable
[Git Source](https://github.com/daokitchen/nouns-stream/blob/c3b52a7ea0bf77a05c09aab9730867448a5dfdc7/src/utils/interfaces/IOwnable.sol)


## Functions
### owner

The address of the owner


```solidity
function owner() external view returns (address);
```

### pendingOwner

The address of the pending owner


```solidity
function pendingOwner() external view returns (address);
```

### transferOwnership

Forces an ownership transfer


```solidity
function transferOwnership(address newOwner) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`newOwner`|`address`|The new owner address|


### safeTransferOwnership

Initiates a two-step ownership transfer


```solidity
function safeTransferOwnership(address newOwner) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`newOwner`|`address`|The new owner address|


### acceptOwnership

Accepts an ownership transfer


```solidity
function acceptOwnership() external;
```

### cancelOwnershipTransfer

Cancels a pending ownership transfer


```solidity
function cancelOwnershipTransfer() external;
```

## Events
### OwnerUpdated
Emitted when ownership has been updated


```solidity
event OwnerUpdated(address indexed prevOwner, address indexed newOwner);
```

### OwnerPending
Emitted when an ownership transfer is pending


```solidity
event OwnerPending(address indexed owner, address indexed pendingOwner);
```

### OwnerCanceled
Emitted when a pending ownership transfer has been canceled


```solidity
event OwnerCanceled(address indexed owner, address indexed canceledOwner);
```

## Errors
### ONLY_OWNER
*Reverts if an unauthorized user calls an owner function*


```solidity
error ONLY_OWNER();
```

### ONLY_PENDING_OWNER
*Reverts if an unauthorized user calls a pending owner function*


```solidity
error ONLY_PENDING_OWNER();
```

