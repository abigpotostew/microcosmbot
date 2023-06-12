// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.17;

// @notice Factory Storage V1
// @author Matthew Harrison
// @notice The Factory storage contract
contract FactoryStorageV1 {
    /// @notice If a contract has been registered as an upgrade
    /// @dev Base impl => Upgrade impl
    mapping(address => mapping(address => bool)) internal isUpgrade;
}
