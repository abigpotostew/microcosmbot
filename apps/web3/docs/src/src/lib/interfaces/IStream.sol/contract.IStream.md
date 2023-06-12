# IStream
[Git Source](https://github.com/daokitchen/nouns-stream/blob/c3b52a7ea0bf77a05c09aab9730867448a5dfdc7/src/lib/interfaces/IStream.sol)

**Inherits:**
[IPausable](/src/utils/interfaces/IPausable.sol/contract.IPausable.md)

**Author:**
Matthew Harrison

An interface for the Stream contract


## Functions
### token

The address of the token for payments


```solidity
function token() external view returns (address);
```

### botDAO

The address of the of the botDAO


```solidity
function botDAO() external view returns (address);
```

### balance

Retrieve the current balance of a stream


```solidity
function balance() external returns (uint256);
```

### nextPayment

Retrieve the next payment of a stream


```solidity
function nextPayment() external returns (uint256);
```

### release

Release of streams


```solidity
function release() external returns (uint256);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|amount of funds released|


### claim

Release funds of a single stream with no tip payout


```solidity
function claim() external payable returns (uint256);
```

### withdraw

Withdraw funds from smart contract, only the owner can do this.


```solidity
function withdraw() external payable;
```

### unpause

// @notice Unpause stream


```solidity
function unpause() external;
```

### changeRecipient

Change the recipient address


```solidity
function changeRecipient(address newRecipient) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`newRecipient`|`address`|The new recipient address|


## Events
### FundsDisbursed
Emits event when funds are disbursed


```solidity
event FundsDisbursed(address streamId, uint256 amount, string streamType);
```

### Withdraw
Emits event when funds are disbursed


```solidity
event Withdraw(address streamId, uint256 amount);
```

### RecipientChanged
Emits event when recipient is changed


```solidity
event RecipientChanged(address oldRecipient, address newRecipient);
```

## Errors
### INCORRECT_DATE_RANGE
*Thrown if the start date is greater than the end date*


```solidity
error INCORRECT_DATE_RANGE();
```

### NO_FUNDS_TO_DISBURSE
*Thrown if release of claim has no funds to disburse*


```solidity
error NO_FUNDS_TO_DISBURSE();
```

### STREAM_HASNT_STARTED
*Thrown if if the stream has not started*


```solidity
error STREAM_HASNT_STARTED();
```

### STREAM_FINISHED
*Thrown if the stream has made its final payment*


```solidity
error STREAM_FINISHED();
```

### ONLY_RECIPIENT
*Thrown if msg.sender is not the recipient*


```solidity
error ONLY_RECIPIENT();
```

