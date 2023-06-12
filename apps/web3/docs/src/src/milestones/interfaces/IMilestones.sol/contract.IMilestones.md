# IMilestones
[Git Source](https://github.com/daokitchen/nouns-stream/blob/c3b52a7ea0bf77a05c09aab9730867448a5dfdc7/src/milestones/interfaces/IMilestones.sol)

**Inherits:**
[IStream](/src/lib/interfaces/IStream.sol/contract.IStream.md)

**Author:**
Matthew Harrison

An interface for the Milestones stream contract


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
) external returns (address);
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


