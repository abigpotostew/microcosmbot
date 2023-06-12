# IUUPS
[Git Source](https://github.com/daokitchen/nouns-stream/blob/c3b52a7ea0bf77a05c09aab9730867448a5dfdc7/src/proxy/interfaces/IUUPS.sol)

**Inherits:**
[IERC1967Upgrade](/src/proxy/interfaces/IERC1967Upgrade.sol/contract.IERC1967Upgrade.md), IERC1822Proxiable

**Author:**
Rohan Kulkarni

The external UUPS errors and functions

repo github.com/ourzora/nouns-protocol


## Functions
### upgradeTo

//
FUNCTIONS                      //
//

Upgrades to an implementation


```solidity
function upgradeTo(address newImpl) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`newImpl`|`address`|The new implementation address|


### upgradeToAndCall

Upgrades to an implementation with an additional function call


```solidity
function upgradeToAndCall(address newImpl, bytes memory data) external payable;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`newImpl`|`address`|The new implementation address|
|`data`|`bytes`|The encoded function call|


## Errors
### ONLY_CALL
//
ERRORS                        //
//

*Reverts if not called directly*


```solidity
error ONLY_CALL();
```

### ONLY_DELEGATECALL
*Reverts if not called via delegatecall*


```solidity
error ONLY_DELEGATECALL();
```

### ONLY_PROXY
*Reverts if not called via proxy*


```solidity
error ONLY_PROXY();
```

