# Ownable
[Git Source](https://github.com/daokitchen/nouns-stream/blob/c3b52a7ea0bf77a05c09aab9730867448a5dfdc7/src/utils/Ownable.sol)

**Inherits:**
[IOwnable](/src/utils/interfaces/IOwnable.sol/contract.IOwnable.md), [Initializable](/src/utils/Initializable.sol/contract.Initializable.md)


## State Variables
### _owner
*The address of the owner*


```solidity
address internal _owner;
```


### _pendingOwner
*The address of the pending owner*


```solidity
address internal _pendingOwner;
```


## Functions
### onlyOwner

*Ensures the caller is the owner*


```solidity
modifier onlyOwner();
```

### onlyPendingOwner

*Ensures the caller is the pending owner*


```solidity
modifier onlyPendingOwner();
```

### __Ownable_init

*Initializes contract ownership*


```solidity
function __Ownable_init(address _initialOwner) internal onlyInitializing;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_initialOwner`|`address`|The initial owner address|


### owner

The address of the owner


```solidity
function owner() public view virtual returns (address);
```

### pendingOwner

The address of the pending owner


```solidity
function pendingOwner() public view returns (address);
```

### transferOwnership

Forces an ownership transfer from the last owner


```solidity
function transferOwnership(address _newOwner) public onlyOwner;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_newOwner`|`address`|The new owner address|


### _transferOwnership

Forces an ownership transfer from any sender

*Ensure is called only from trusted internal code, no access control checks.*


```solidity
function _transferOwnership(address _newOwner) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_newOwner`|`address`|New owner to transfer contract to|


### safeTransferOwnership

Initiates a two-step ownership transfer


```solidity
function safeTransferOwnership(address _newOwner) public onlyOwner;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_newOwner`|`address`|The new owner address|


### acceptOwnership

Accepts an ownership transfer


```solidity
function acceptOwnership() public onlyPendingOwner;
```

### cancelOwnershipTransfer

Cancels a pending ownership transfer


```solidity
function cancelOwnershipTransfer() public onlyOwner;
```

