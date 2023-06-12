# ERC1967Proxy
[Git Source](https://github.com/daokitchen/nouns-stream/blob/c3b52a7ea0bf77a05c09aab9730867448a5dfdc7/src/proxy/ERC1967Proxy.sol)

**Inherits:**
[IERC1967Upgrade](/src/proxy/interfaces/IERC1967Upgrade.sol/contract.IERC1967Upgrade.md), Proxy, [ERC1967Upgrade](/src/proxy/ERC1967Upgrade.sol/contract.ERC1967Upgrade.md)

**Author:**
Rohan Kulkarni

Modified from OpenZeppelin Contracts v4.7.3 (proxy/ERC1967/ERC1967Proxy.sol)
- Inherits a modern, minimal ERC1967Upgrade


## Functions
### constructor

//
CONSTRUCTOR                      //
//

*Initializes the proxy with an implementation contract and encoded function call*


```solidity
constructor(address _logic, bytes memory _data) payable;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_logic`|`address`|The implementation address|
|`_data`|`bytes`|The encoded function call|


### _implementation

//
FUNCTIONS                       //
//

*The address of the current implementation*


```solidity
function _implementation() internal view virtual override returns (address);
```

