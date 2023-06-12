# Stream
[Git Source](https://github.com/daokitchen/nouns-stream/blob/c3b52a7ea0bf77a05c09aab9730867448a5dfdc7/src/lib/Stream.sol)

**Inherits:**
[IStream](/src/lib/interfaces/IStream.sol/contract.IStream.md), [VersionedContract](/src/VersionedContract.sol/contract.VersionedContract.md), [Pausable](/src/utils/Pausable.sol/contract.Pausable.md), [Ownable](/src/utils/Ownable.sol/contract.Ownable.md)

**Author:**
Matthew Harrison

The base contract for all streams


## State Variables
### token
The token used for stream payments


```solidity
address public token;
```


### botDAO
The address of the botDAO


```solidity
address public botDAO;
```


### recipient
The recipient address


```solidity
address public recipient;
```


## Functions
### withdraw

Withdraw funds from smart contract, only the owner can do this.


```solidity
function withdraw() external payable onlyOwner;
```

### pause

Pause the whole contract


```solidity
function pause() external onlyOwner;
```

### unpause

Pause the whole contract


```solidity
function unpause() external onlyOwner;
```

### balance

Get the balance of the contract


```solidity
function balance() external view returns (uint256);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The balance of the contract|


### changeRecipient

Change the recipient address


```solidity
function changeRecipient(address newRecipient) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`newRecipient`|`address`|The new recipient address|


### _distribute

Distribute payout


```solidity
function _distribute(address _to, uint256 _amount) public;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_to`|`address`|Account receieve transfer|
|`_amount`|`uint256`|Amount to transfer|


### receive

ERC20 transfer
ETH transfer
Limit the call to 50,000 gas


```solidity
receive() external payable;
```

