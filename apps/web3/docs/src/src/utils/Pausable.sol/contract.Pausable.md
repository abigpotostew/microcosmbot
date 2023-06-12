# Pausable
[Git Source](https://github.com/daokitchen/nouns-stream/blob/c3b52a7ea0bf77a05c09aab9730867448a5dfdc7/src/utils/Pausable.sol)

**Inherits:**
[IPausable](/src/utils/interfaces/IPausable.sol/contract.IPausable.md), [Initializable](/src/utils/Initializable.sol/contract.Initializable.md)

Modified from OpenZeppelin Contracts v4.7.3 (security/PausableUpgradeable.sol)
- Uses custom errors declared in IPausable

repo github.com/ourzora/nouns-protocol


## State Variables
### _paused
*If the contract is paused*


```solidity
bool internal _paused;
```


## Functions
### whenPaused

*Ensures the contract is paused*


```solidity
modifier whenPaused();
```

### whenNotPaused

*Ensures the contract isn't paused*


```solidity
modifier whenNotPaused();
```

### __Pausable_init

*Sets whether the initial state*


```solidity
function __Pausable_init(bool _initPause) internal onlyInitializing;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_initPause`|`bool`|If the contract should pause upon initialization|


### paused

If the contract is paused


```solidity
function paused() external view returns (bool);
```

### _pause

*Pauses the contract*


```solidity
function _pause() internal virtual whenNotPaused;
```

### _unpause

*Unpauses the contract*


```solidity
function _unpause() internal virtual whenPaused;
```

