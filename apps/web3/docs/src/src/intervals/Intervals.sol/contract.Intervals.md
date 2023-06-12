# Intervals
[Git Source](https://github.com/daokitchen/nouns-stream/blob/c3b52a7ea0bf77a05c09aab9730867448a5dfdc7/src/intervals/Intervals.sol)

**Inherits:**
[IIntervals](/src/intervals/interfaces/IIntervals.sol/contract.IIntervals.md), [Stream](/src/lib/Stream.sol/contract.Stream.md)

**Author:**
Matthew Harrison

The contract for all streams with intervals


## State Variables
### startDate
The start date of the stream


```solidity
uint64 internal startDate;
```


### endDate
The end date of the stream


```solidity
uint64 internal endDate;
```


### interval
The interval of the stream


```solidity
uint32 internal interval;
```


### tip
The tip of the stream, paid to the bot


```solidity
uint96 internal tip;
```


### paid
The amount paid to the recipient


```solidity
uint256 internal paid;
```


### owed
The amount owed to the recipient


```solidity
uint256 internal owed;
```


## Functions
### constructor


```solidity
constructor() payable initializer;
```

### initialize

Initialize the contract


```solidity
function initialize(
    address _owner,
    uint64 _startDate,
    uint64 _endDate,
    uint32 _interval,
    uint96 _tip,
    uint256 _owed,
    address _recipient,
    address _token
) external initializer returns (address);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_owner`|`address`|The owner address of the contract|
|`_startDate`|`uint64`|The start date of the stream|
|`_endDate`|`uint64`|The end date of the stream|
|`_interval`|`uint32`|The interval of the stream|
|`_tip`|`uint96`|The tip of the stream, paid to the bot|
|`_owed`|`uint256`|The amount owed to the recipient|
|`_recipient`|`address`|The recipient address of the stream|
|`_token`|`address`|The token address of the stream|


### release

Grant initial ownership to a founder
Pause the contract until the first auction

Distribute payout


```solidity
function release() external whenNotPaused returns (uint256);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The amount disbursed|


### claim

Release funds of a single stream with no tip payout


```solidity
function claim() external payable whenNotPaused returns (uint256);
```

### nextPayment

Retrieve the current balance of a stream


```solidity
function nextPayment() external view returns (uint256);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The next payment amount|


### getCurrentInterval

Get stream details


```solidity
function getCurrentInterval() external view returns (uint64, uint64, uint32, uint96, uint256, uint256, address);
```

### _nextPayment

Gets balance of stream


```solidity
function _nextPayment() internal view returns (uint256, uint256);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The next payment amount|
|`<none>`|`uint256`|The amount of the stream that has been paid|


