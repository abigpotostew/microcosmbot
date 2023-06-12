# Milestones
[Git Source](https://github.com/daokitchen/nouns-stream/blob/c3b52a7ea0bf77a05c09aab9730867448a5dfdc7/src/milestones/Milestones.sol)

**Inherits:**
[IMilestones](/src/milestones/interfaces/IMilestones.sol/contract.IMilestones.md), [Stream](/src/lib/Stream.sol/contract.Stream.md)

**Author:**
Matthew Harrison

A milestone based stream contract


## State Variables
### msPayments
The milestone payments array


```solidity
uint256[] internal msPayments;
```


### msDates
The milestone dates array


```solidity
uint64[] internal msDates;
```


### currentMilestone
The current milestone incrementer


```solidity
uint48 internal currentMilestone;
```


### tip
The tip for the bot


```solidity
uint96 internal tip;
```


## Functions
### initialize

Initialize the contract


```solidity
function initialize(
    address _owner,
    uint256[] calldata _msPayments,
    uint64[] calldata _msDates,
    uint96 _tip,
    address _recipient,
    address _token
) external initializer returns (address);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_owner`|`address`|The owner address of the contract|
|`_msPayments`|`uint256[]`|The payments for each milestone|
|`_msDates`|`uint64[]`|The dates for each milestone|
|`_tip`|`uint96`|The tip of the stream, paid to the bot|
|`_recipient`|`address`|The recipient address of the stream|
|`_token`|`address`|The token used for stream payments|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`address`|The address of the contract|


### release

Grant initial ownership to a founder
Pause the contract until the first auction

Distribute payouts with tip calculation


```solidity
function release() external whenNotPaused returns (uint256);
```

### claim

Release funds of a single stream with no tip payout


```solidity
function claim() external payable whenNotPaused returns (uint256);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The amount disbursed|


### nextPayment

Retrieve the current balance of a stream


```solidity
function nextPayment() external view returns (uint256);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The balance of the stream|


### getCurrentMilestone

Get the current meta information about the stream


```solidity
function getCurrentMilestone() external view returns (uint48, uint256, uint64, uint96, address);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint48`|The current milestone index|
|`<none>`|`uint256`|The current milestone payment|
|`<none>`|`uint64`|The current milestone date|
|`<none>`|`uint96`|The tip of the stream|
|`<none>`|`address`|The recipient address of the stream|


### getMilestone

Get the milestone payment and date via an index


```solidity
function getMilestone(uint88 index) external view returns (uint256, uint64);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`index`|`uint88`|The index of the milestone|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The milestone payment|
|`<none>`|`uint64`|The milestone date|


### getMilestoneLength

Get the length of the milestones array


```solidity
function getMilestoneLength() external view returns (uint256, uint256);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The length of the milestones array|
|`<none>`|`uint256`||


### _nextPayment

Gets the next payment amount


```solidity
function _nextPayment() internal view returns (uint256);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The next payment amount|


