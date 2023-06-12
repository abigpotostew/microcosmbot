# UUPS
[Git Source](https://github.com/daokitchen/nouns-stream/blob/c3b52a7ea0bf77a05c09aab9730867448a5dfdc7/src/proxy/UUPS.sol)

**Inherits:**
[IUUPS](/src/proxy/interfaces/IUUPS.sol/contract.IUUPS.md), [ERC1967Upgrade](/src/proxy/ERC1967Upgrade.sol/contract.ERC1967Upgrade.md)

**Author:**
Rohan Kulkarni

Modified from OpenZeppelin Contracts v4.7.3 (proxy/utils/UUPSUpgradeable.sol)
- Uses custom errors declared in IUUPS
- Inherits a modern, minimal ERC1967Upgrade

repo github.com/ourzora/nouns-protocol


## State Variables
### __self
*The address of the implementation*


```solidity
address private immutable __self = address(this);
```


## Functions
### onlyProxy

*Ensures that execution is via proxy delegatecall with the correct implementation*


```solidity
modifier onlyProxy();
```

### notDelegated

*Ensures that execution is via direct call*


```solidity
modifier notDelegated();
```

### _authorizeUpgrade

*Hook to authorize an implementation upgrade*


```solidity
function _authorizeUpgrade(address _newImpl) internal virtual;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_newImpl`|`address`|The new implementation address|


### upgradeTo

Upgrades to an implementation


```solidity
function upgradeTo(address _newImpl) external onlyProxy;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_newImpl`|`address`|The new implementation address|


### upgradeToAndCall

Upgrades to an implementation with an additional function call


```solidity
function upgradeToAndCall(address _newImpl, bytes memory _data) external payable onlyProxy;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_newImpl`|`address`|The new implementation address|
|`_data`|`bytes`|The encoded function call|


### proxiableUUID

The storage slot of the implementation address


```solidity
function proxiableUUID() external view notDelegated returns (bytes32);
```

