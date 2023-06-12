# FullMath
[Git Source](https://github.com/daokitchen/nouns-stream/blob/c3b52a7ea0bf77a05c09aab9730867448a5dfdc7/src/utils/FullMath.sol)

Facilitates multiplication and division that can have overflow of an intermediate value without any loss of precision

*Handles "phantom overflow" i.e., allows multiplication and division where an intermediate value overflows 256 bits
from https://github.com/ZeframLou/vested-erc20/blob/main/src/lib/FullMath.sol*


## Functions
### mulDiv

Calculates floor(a×b÷denominator) with full precision. Throws if result overflows a uint256 or denominator == 0

*Credit to Remco Bloemen under MIT license https://xn--2-umb.com/21/muldiv*


```solidity
function mulDiv(uint256 a, uint256 b, uint256 denominator) internal pure returns (uint256 result);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`a`|`uint256`|The multiplicand|
|`b`|`uint256`|The multiplier|
|`denominator`|`uint256`|The divisor|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`result`|`uint256`|The 256-bit result|


### mulDivRoundingUp

Calculates ceil(a×b÷denominator) with full precision. Throws if result overflows a uint256 or denominator == 0


```solidity
function mulDivRoundingUp(uint256 a, uint256 b, uint256 denominator) internal pure returns (uint256 result);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`a`|`uint256`|The multiplicand|
|`b`|`uint256`|The multiplier|
|`denominator`|`uint256`|The divisor|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`result`|`uint256`|The 256-bit result|


