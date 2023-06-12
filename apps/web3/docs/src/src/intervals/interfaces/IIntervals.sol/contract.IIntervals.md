# IIntervals
[Git Source](https://github.com/daokitchen/nouns-stream/blob/c3b52a7ea0bf77a05c09aab9730867448a5dfdc7/src/intervals/interfaces/IIntervals.sol)

**Inherits:**
[IStream](/src/lib/interfaces/IStream.sol/contract.IStream.md)

**Author:**
Matthew Harrison

An interface for the Intervals stream contract


## Functions
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
) external returns (address);
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


### getCurrentInterval

Get the current meta information about the stream


```solidity
function getCurrentInterval() external view returns (uint64, uint64, uint32, uint96, uint256, uint256, address);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint64`|The start date of the stream|
|`<none>`|`uint64`|The end date of the stream|
|`<none>`|`uint32`|The interval of the stream|
|`<none>`|`uint96`|The tip of the stream|
|`<none>`|`uint256`|The amount paid to the recipient|
|`<none>`|`uint256`|The amount owed to the recipient|
|`<none>`|`address`|The recipient address of the stream|


