# Factory
[Git Source](https://github.com/daokitchen/nouns-stream/blob/c3b52a7ea0bf77a05c09aab9730867448a5dfdc7/src/lib/Factory.sol)

**Inherits:**
[IFactory](/src/lib/interfaces/IFactory.sol/contract.IFactory.md), [VersionedContract](/src/VersionedContract.sol/contract.VersionedContract.md), [UUPS](/src/proxy/UUPS.sol/contract.UUPS.md), [Ownable](/src/utils/Ownable.sol/contract.Ownable.md), [FactoryStorageV1](/src/intervals/storage/IntervalsStorageV1.sol/contract.FactoryStorageV1.md)

**Author:**
Matthew Harrison

The base Factory contract


## Functions
### batchRelease

A batch interface to release funds across multiple streams


```solidity
function batchRelease(address[] calldata streams) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`streams`|`address[]`|List of DAOStreams to call|


### isRegisteredUpgrade

If an implementation is registered by the Builder DAO as an optional upgrade


```solidity
function isRegisteredUpgrade(address _baseImpl, address _upgradeImpl) external view returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_baseImpl`|`address`|The base implementation address|
|`_upgradeImpl`|`address`|The upgrade implementation address|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the upgrade is registered, false otherwise|


### registerUpgrade

Called by the Builder DAO to offer implementation upgrades for created DAOs


```solidity
function registerUpgrade(address _baseImpl, address _upgradeImpl) external onlyOwner;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_baseImpl`|`address`|The base implementation address|
|`_upgradeImpl`|`address`|The upgrade implementation address|


### removeUpgrade

Called by the Builder DAO to remove an upgrade


```solidity
function removeUpgrade(address _baseImpl, address _upgradeImpl) external onlyOwner;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_baseImpl`|`address`|The base implementation address|
|`_upgradeImpl`|`address`|The upgrade implementation address|


### _safeGetVersion

Safely get the contract version of a target contract.

*Assume `target` is a contract*


```solidity
function _safeGetVersion(address target) internal pure returns (string memory);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`string`|Contract version if found, empty string if not.|


### getStreamVersion

Get current version of contract


```solidity
function getStreamVersion(address streamImpl) external pure returns (string memory);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`streamImpl`|`address`|Address of DAO version lookup|


### _authorizeUpgrade

Ensures the caller is authorized to upgrade the contract

*This function is called in `upgradeTo` & `upgradeToAndCall`*


```solidity
function _authorizeUpgrade(address _newImpl) internal override onlyOwner;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_newImpl`|`address`|The new implementation address|


