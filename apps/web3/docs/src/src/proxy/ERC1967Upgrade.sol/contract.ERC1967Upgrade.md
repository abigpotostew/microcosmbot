# ERC1967Upgrade
[Git Source](https://github.com/daokitchen/nouns-stream/blob/c3b52a7ea0bf77a05c09aab9730867448a5dfdc7/src/proxy/ERC1967Upgrade.sol)

**Inherits:**
[IERC1967Upgrade](/src/proxy/interfaces/IERC1967Upgrade.sol/contract.IERC1967Upgrade.md)


## State Variables
### _ROLLBACK_SLOT
*bytes32(uint256(keccak256('eip1967.proxy.rollback')) - 1)*


```solidity
bytes32 private constant _ROLLBACK_SLOT = 0x4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143;
```


### _IMPLEMENTATION_SLOT
*bytes32(uint256(keccak256('eip1967.proxy.implementation')) - 1)*


```solidity
bytes32 internal constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
```


## Functions
### _upgradeToAndCallUUPS

*Upgrades to an implementation with security checks for UUPS proxies and an additional function call*


```solidity
function _upgradeToAndCallUUPS(address _newImpl, bytes memory _data, bool _forceCall) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_newImpl`|`address`|The new implementation address|
|`_data`|`bytes`|The encoded function call|
|`_forceCall`|`bool`||


### _upgradeToAndCall

*Upgrades to an implementation with an additional function call*


```solidity
function _upgradeToAndCall(address _newImpl, bytes memory _data, bool _forceCall) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_newImpl`|`address`|The new implementation address|
|`_data`|`bytes`|The encoded function call|
|`_forceCall`|`bool`||


### _upgradeTo

*Performs an implementation upgrade*


```solidity
function _upgradeTo(address _newImpl) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_newImpl`|`address`|The new implementation address|


### _setImplementation

*Stores the address of an implementation*


```solidity
function _setImplementation(address _impl) private;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_impl`|`address`|The implementation address|


### _getImplementation

*The address of the current implementation*


```solidity
function _getImplementation() internal view returns (address);
```

