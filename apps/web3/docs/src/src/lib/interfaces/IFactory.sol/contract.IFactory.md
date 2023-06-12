# IFactory
[Git Source](https://github.com/daokitchen/nouns-stream/blob/c3b52a7ea0bf77a05c09aab9730867448a5dfdc7/src/lib/interfaces/IFactory.sol)

**Author:**
Matthew Harrison

An interface for the Factory contract


## Functions
### batchRelease

A batch interface to release funds across multiple streams


```solidity
function batchRelease(address[] calldata streams) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`streams`|`address[]`|List of streams to distribute funds from|


### isRegisteredUpgrade

If an implementation is registered by the Builder DAO as an optional upgrade


```solidity
function isRegisteredUpgrade(address baseImpl, address upgradeImpl) external view returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`baseImpl`|`address`|The base implementation address|
|`upgradeImpl`|`address`|The upgrade implementation address|


### registerUpgrade

Called by the Builder DAO to offer opt-in implementation upgrades for all other DAOs


```solidity
function registerUpgrade(address baseImpl, address upgradeImpl) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`baseImpl`|`address`|The base implementation address|
|`upgradeImpl`|`address`|The upgrade implementation address|


### removeUpgrade

Called by the Builder DAO to remove an upgrade


```solidity
function removeUpgrade(address baseImpl, address upgradeImpl) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`baseImpl`|`address`|The base implementation address|
|`upgradeImpl`|`address`|The upgrade implementation address|


### getStreamVersion

Get current version of contract


```solidity
function getStreamVersion(address daoStream) external pure returns (string memory);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`daoStream`|`address`|Address of DAO version lookup|


## Events
### StreamCreated
Emits stream created event


```solidity
event StreamCreated(address streamId, string streamType);
```

### UpgradeRegistered
Emitted when an upgrade is registered by the Builder DAO


```solidity
event UpgradeRegistered(address baseImpl, address upgradeImpl);
```

### UpgradeRemoved
Emitted when an upgrade is unregistered by the Builder DAO


```solidity
event UpgradeRemoved(address baseImpl, address upgradeImpl);
```

