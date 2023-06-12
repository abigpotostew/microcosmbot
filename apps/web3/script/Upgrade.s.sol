// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.17;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import { ERC1967Proxy } from "../src/proxy/ERC1967Proxy.sol";
import { Manager } from "../src/manager/Manager.sol";
import { Milestones } from "../src/milestones/Milestones.sol";
import { IMilestones } from "../src/milestones/interfaces/IMilestones.sol";
import { Intervals } from "../src/intervals/Intervals.sol";

contract UpgradeContracts is Script {
    function run() public {
        address bot = vm.envAddress("SAFE");
        address manAddress = vm.envAddress("DEPLOYED_MANGER");

        vm.startBroadcast();

        address mileImpl = address(new Milestones());
        address intImpl = address(new Intervals());
        address managerImpl = address(new Manager(mileImpl, intImpl, bot));

        Manager manager = Manager(manAddress);
        manager.upgradeTo(managerImpl);

        vm.stopBroadcast();

        console2.log("SAFE:");
        console2.log(bot);
        console2.log("Milestone impl");
        console2.logAddress(mileImpl);
        console2.log("Interval impl");
        console2.logAddress(intImpl);
        console2.log("Manager Factory impl 1");
        console2.logAddress(managerImpl);
        console2.log("Manager Factory proxy");
        console2.logAddress(address(manager));
        console2.log("");
    }
}
