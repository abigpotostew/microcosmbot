// Copyright 2023 matthewharrison
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.17;

import { Test } from "forge-std/Test.sol";
import "forge-std/console2.sol";

import { Manager } from "../../src/manager/Manager.sol";

import { IMilestones } from "../../src/milestones/interfaces/IMilestones.sol";
import { Milestones } from "../../src/milestones/Milestones.sol";

import { IIntervals } from "../../src/intervals/interfaces/IIntervals.sol";
import { Intervals } from "../../src/intervals/Intervals.sol";

import { ERC1967Proxy } from "../../src/proxy/ERC1967Proxy.sol";
import { WETH } from "../mocks/WETH.sol";
import { MockERC20 } from "../mocks/MockERC20.sol";

contract NounsStreamTest is Test {
    address[] internal streamAddresses;
    address internal token;
    address internal erc20Token;
    MockERC20 internal erc20;

    // Manager
    Manager internal manager;
    address internal managerImpl0;
    address internal managerImpl;

    // Milestones
    IMilestones internal milestones;
    IMilestones internal milestones1;
    IMilestones internal milestones2;
    IMilestones[] internal msList;
    address internal mileImpl;

    uint64[][] internal msDates;
    uint256[][] internal msPayments;
    uint64[] internal msDates1;
    uint256[] internal msPayments1;
    uint64[] internal msDates2;
    uint256[] internal msPayments2;

    // Intervals
    IIntervals internal intervals;
    IIntervals[] internal intList;
    address internal intImpl;

    // Users
    address internal nounsDAO;
    address internal streamDAO;
    address internal bot;
    address internal owner;
    address internal receiver;
    address[] internal receivers;
    address internal weth;

    uint256 internal blockTimestamp;
    uint256 internal startDate;
    uint256 internal endDate;
    uint256 internal startDate1;
    uint256 internal endDate1;
    uint256 internal owed;
    uint256 internal paid;
    uint256 internal interval;
    uint96 internal tip;
    bytes data;

    function setUp() public virtual {
        // console2.logString("Begin Setup");

        // Universal variables
        weth = address(new WETH());

        nounsDAO = vm.addr(0x1AB);
        streamDAO = vm.addr(0xCCC);
        bot = 0xAb07432f6cEffc8f122527d6a1638e362dc1b249;

        owner = vm.addr(0xDDD);
        receiver = vm.addr(0xBBB);
        receivers = new address[](5);
        receivers[0] = vm.addr(0xADA);
        receivers[1] = vm.addr(0xCCC);
        receivers[2] = vm.addr(0xDDD);
        receivers[3] = vm.addr(0xEEE);
        receivers[4] = vm.addr(0xFFF);

        vm.label(streamDAO, "STREAM_DAO");
        vm.label(nounsDAO, "NOUNS_DAO");
        vm.label(bot, "BOT");
        vm.label(owner, "OWNER");
        vm.label(receiver, "RECEIVER");

        streamAddresses = new address[](8);
        // console2.logString("End Setup");
    }

    function deployMockERC20() internal {
        // console2.logString("Begin Deploy Mock ERC20");
        erc20 = new MockERC20("Mock Token", "MOCK");
        erc20.mint(100e18);
        erc20Token = address(erc20);
    }

    function deployManagerMock() internal virtual {
        // console2.logString("Begin Deploy Manager Mock");

        _managerInit();
        deployMockERC20();

        _milestonesInit();
        streamAddresses[0] = manager.createMSStream(owner, msPayments1, msDates1, tip, receiver, token);
        msList[0] = milestones = IMilestones(streamAddresses[0]);
        vm.label(streamAddresses[0], "MILESTONES1");
        streamAddresses[1] = manager.createMSStream(owner, msPayments2, msDates2, tip, receiver, token);
        msList[1] = IMilestones(streamAddresses[1]);
        vm.label(streamAddresses[1], "MILESTONES2");

        streamAddresses[2] = manager.createMSStream(owner, msPayments1, msDates1, tip, receiver, erc20Token);
        msList[2] = IMilestones(streamAddresses[2]);
        vm.label(streamAddresses[2], "MILESTONES3");

        erc20.transfer(streamAddresses[2], 30e18);

        streamAddresses[3] = manager.createMSStream(owner, msPayments2, msDates2, tip, receiver, erc20Token);
        msList[3] = IMilestones(streamAddresses[3]);
        vm.label(streamAddresses[3], "MILESTONES4");

        _intervalsInit();
        streamAddresses[4] = manager.createIntvStream(owner, startDate, endDate, interval, owed, tip, receiver, token);
        intList[0] = intervals = IIntervals(streamAddresses[4]);
        vm.label(streamAddresses[4], "INTERVAL1");

        streamAddresses[5] = manager.createIntvStream(owner, startDate1, endDate1, interval, owed, tip, receiver, token);
        intList[1] = IIntervals(streamAddresses[5]);
        vm.label(streamAddresses[5], "INTERVAL2");

        streamAddresses[6] = manager.createIntvStream(owner, startDate, endDate, interval, owed, tip, receiver, erc20Token);
        intList[2] = IIntervals(streamAddresses[6]);
        vm.label(streamAddresses[6], "INTERVAL3");

        erc20.transfer(streamAddresses[6], owed * 4);

        streamAddresses[7] = manager.createIntvStream(owner, startDate1, endDate1, interval, owed, tip, receiver, erc20Token);
        intList[3] = IIntervals(streamAddresses[7]);
        vm.label(streamAddresses[7], "INTERVAL4");
    }

    function _managerInit() internal virtual {
        // Manager init
        // console2.logString("Manager Init");

        managerImpl0 = address(new Manager(address(0), address(0), address(0)));
        manager = Manager(address(new ERC1967Proxy(managerImpl0, abi.encodeWithSignature("initialize(address)", streamDAO))));
        mileImpl = address(new Milestones());
        intImpl = address(new Intervals());
        managerImpl = address(new Manager(mileImpl, intImpl, bot));
        vm.prank(streamDAO);
        manager.upgradeTo(managerImpl);
    }

    function _milestonesInit() internal virtual {
        // Milestones init
        // console2.logString("Milestone Init");

        vm.prank(streamDAO);
        msList = new IMilestones[](4);

        startDate = block.timestamp - 180 days;
        endDate = block.timestamp + 180 days;
        owed = 20e18; // 20 ETH
        paid = 0; // 0
        tip = 1e16; // 1 percent
        interval = 2 weeks;
        token = address(0);
        msPayments1 = [3e18, 2e18, 1e18];
        msDates1 = [uint64(block.timestamp - 14 days), uint64(block.timestamp - 7 days), uint64(block.timestamp - 1 minutes)];
        msPayments2 = [3e18, 2e18, 1e18];
        msDates2 = [uint64(block.timestamp + 14 days), uint64(block.timestamp + 28 days), uint64(block.timestamp + 56 days)];
        msPayments = [msPayments1, msPayments2];
        msDates = [msDates1, msDates2];
    }

    function _intervalsInit() internal virtual {
        // Intervals init
        // console2.logString("Intervals Init");
        vm.prank(streamDAO);
        intList = new IIntervals[](4);
        token = address(0);

        startDate = block.timestamp - 3 weeks;
        endDate = block.timestamp + 8 weeks;
        startDate1 = block.timestamp + 3 weeks;
        endDate1 = block.timestamp + 6 weeks;
        owed = 2e18; // 20 ETH
        paid = 0; // 0
        tip = 1e16; // 1 percent
        interval = 2 weeks;
    }
}
