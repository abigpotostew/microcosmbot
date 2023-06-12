# Address
[Git Source](https://github.com/daokitchen/nouns-stream/blob/c3b52a7ea0bf77a05c09aab9730867448a5dfdc7/src/utils/Address.sol)


## Functions
### toBytes32

*Utility to convert an address to bytes32*


```solidity
function toBytes32(address _account) internal pure returns (bytes32);
```

### isContract

*If an address is a contract*


```solidity
function isContract(address _account) internal view returns (bool rv);
```

### functionDelegateCall

*Performs a delegatecall on an address*


```solidity
function functionDelegateCall(address _target, bytes memory _data) internal returns (bytes memory);
```

### verifyCallResult

*Verifies a delegatecall was successful*


```solidity
function verifyCallResult(bool _success, bytes memory _returndata) internal pure returns (bytes memory);
```

## Errors
### INVALID_TARGET
*Reverts if the target of a delegatecall is not a contract*


```solidity
error INVALID_TARGET();
```

### DELEGATE_CALL_FAILED
*Reverts if a delegatecall has failed*


```solidity
error DELEGATE_CALL_FAILED();
```

