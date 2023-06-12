// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.17;

import { UUPS } from "../../src/proxy/UUPS.sol";

contract MockImpl is UUPS {
    function _authorizeUpgrade(address _newImpl) internal view override {}
}
