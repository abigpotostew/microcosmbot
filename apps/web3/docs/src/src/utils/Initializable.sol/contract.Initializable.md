# Initializable
[Git Source](https://github.com/daokitchen/nouns-stream/blob/c3b52a7ea0bf77a05c09aab9730867448a5dfdc7/src/utils/Initializable.sol)

**Inherits:**
[IInitializable](/src/utils/interfaces/IInitializable.sol/contract.IInitializable.md)


## State Variables
### _initialized
*Indicates the contract has been initialized*


```solidity
uint8 internal _initialized;
```


### _initializing
*Indicates the contract is being initialized*


```solidity
bool internal _initializing;
```


## Functions
### onlyInitializing

*Ensures an initialization function is only called within an `initializer` or `reinitializer` function*


```solidity
modifier onlyInitializing();
```

### initializer

*Enables initializing upgradeable contracts*


```solidity
modifier initializer();
```

### reinitializer

*Enables initializer versioning*


```solidity
modifier reinitializer(uint8 _version);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_version`|`uint8`|The version to set|


### _disableInitializers

*Prevents future initialization*


```solidity
function _disableInitializers() internal virtual;
```

