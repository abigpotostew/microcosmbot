# IManager
[Git Source](https://github.com/daokitchen/nouns-stream/blob/c3b52a7ea0bf77a05c09aab9730867448a5dfdc7/src/manager/interfaces/IManager.sol)

**Inherits:**
[IFactory](/src/lib/interfaces/IFactory.sol/contract.IFactory.md)

**Author:**
Matthew Harrison

The Manager interface


## Functions
### msImpl

The address of the Milestones implementation


```solidity
function msImpl() external view returns (address);
```

### intvImpl

The address of the Intervals implementation


```solidity
function intvImpl() external view returns (address);
```

### createMSStream

Get the address for an interval stream


```solidity
function createMSStream(
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
|`_owner`|`address`|     Sender address|
|`_msPayments`|`uint256[]`|Milestones payments array|
|`_msDates`|`uint64[]`|   Milestones date array|
|`_tip`|`uint96`|       Chosen percentage allocated to bots who disburse funds|
|`_recipient`|`address`| Receiver of payouts|
|`_token`|`address`|     ERC20 token address|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`address`|address     Address of the stream|


### createIntvStream

Creates a stream


```solidity
function createIntvStream(
    address _owner,
    uint256 _startDate,
    uint256 _endDate,
    uint256 _interval,
    uint256 _owed,
    uint256 _tip,
    address _recipient,
    address _token
) external returns (address);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_owner`|`address`|The owner of the stream|
|`_startDate`|`uint256`|Start date for stream|
|`_endDate`|`uint256`|End date for stream|
|`_interval`|`uint256`|The frequency at which the funds are being released|
|`_owed`|`uint256`|How much is owed to the stream recipient|
|`_tip`|`uint256`|Chosen percentage allocated to bots who disburse funds|
|`_recipient`|`address`|Account which receives disbursed funds|
|`_token`|`address`|Token address|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`address`|address The address of the stream|


### getMSSStreamAddress

Get the address for a milestone stream


```solidity
function getMSSStreamAddress(uint64[] calldata _msDates, address _recipient, address _token)
    external
    view
    returns (address);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_msDates`|`uint64[]`|   Dates of milestones|
|`_recipient`|`address`|  Receiver of payouts|
|`_token`|`address`|     ERC20 token address|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`address`|address     Address of the stream|


### getIntvStreamAddress

Get the address for an interval stream


```solidity
function getIntvStreamAddress(
    uint256 _startDate,
    uint256 _endDate,
    uint256 _interval,
    address _token,
    address _recipient
) external view returns (address);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_startDate`|`uint256`| Start date of the stream|
|`_endDate`|`uint256`|   End date of the stream|
|`_interval`|`uint256`|  Interval to issue payouts|
|`_token`|`address`|     ERC20 token address|
|`_recipient`|`address`| Receiver of payouts|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`address`|address     Address of the stream|


