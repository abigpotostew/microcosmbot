// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.17;

import { NounsStreamTest } from "./utils/NounsStreamTest.sol";

import { IStream } from "../src/lib/interfaces/IStream.sol";
import { IIntervals } from "../src/intervals/interfaces/IIntervals.sol";
import { IMilestones } from "../src/milestones/interfaces/IMilestones.sol";

import { MockImpl } from "./mocks/MockImpl.sol";

contract ManagerTest is NounsStreamTest {
    MockImpl internal mockImpl;
    address[] internal streams;
    uint88[][] internal distributions;

    function setUp() public virtual override {
        super.setUp();
        mockImpl = new MockImpl();
        deployManagerMock();
    }

    function test_GetDAOVersions() public {
        string memory version = manager.getStreamVersion(address(manager));

        assertEq(version, "1.0.0");
    }

    function test_createMSStream() public {
        _milestonesInit();
        manager.createMSStream(owner, msPayments1, msDates1, tip, receivers[1], token);
    }

    function test_predictMSStreamAddress() public {
        address predicted = manager.getMSSStreamAddress(owner, msDates1, receivers[2], token);
        address actual = manager.createMSStream(owner, msPayments1, msDates1, tip, receivers[2], token);
        assertEq(predicted, actual);
    }

    function test_createIntvStream() public {
        _intervalsInit();
        manager.createIntvStream(owner, startDate, endDate, interval, owed, tip, receivers[1], token);
    }

    function test_predictIntvStreamAddress() public {
        address predicted = manager.getIntvStreamAddress(owner, startDate, endDate, interval, token, receivers[2]);
        address actual = manager.createIntvStream(owner, startDate, endDate, interval, owed, tip, receivers[2], token);
        assertEq(predicted, actual);
    }

    function test_batchReleaseAllMilestones() public {
        IMilestones ms1 = msList[0];
        address msAddr1 = address(ms1);
        deal(msAddr1, 6e18);

        streams = new address[](1);
        streams[0] = msAddr1;

        manager.batchRelease(streams);

        uint256 balance1 = msAddr1.balance;
        uint256 nextMs1 = ms1.nextPayment();
        uint256 recBal1 = address(receiver).balance;
        uint256 botBal1 = address(bot).balance;

        assertEq(balance1, 3e18);
        assertEq(nextMs1, 2e18);
        assertEq(recBal1, 299e16);
        assertEq(botBal1, 1e16);

        manager.batchRelease(streams);

        uint256 balance2 = msAddr1.balance;
        uint256 nextMs2 = ms1.nextPayment();
        uint256 recBal2 = address(receiver).balance;
        uint256 botBal2 = address(bot).balance;

        assertEq(balance2, 1e18);
        assertEq(nextMs2, 1e18);
        assertEq(recBal2, 498e16);
        assertEq(botBal2, 2e16);

        manager.batchRelease(streams);

        uint256 balance3 = msAddr1.balance;
        vm.expectRevert(abi.encodeWithSignature("STREAM_FINISHED()"));
        uint256 nextMs3 = ms1.nextPayment();
        uint256 recBal3 = address(receiver).balance;
        uint256 botBal3 = address(bot).balance;

        assertEq(balance3, 0);
        assertEq(nextMs3, 0);
        assertEq(recBal3, 597e16);
        assertEq(botBal3, 3e16);
    }

    function test_batchReleaseAllIntervals() public {
        IIntervals ms1 = intList[0];
        address msAddr1 = address(ms1);
        deal(msAddr1, owed * 5);

        streams = new address[](1);
        streams[0] = msAddr1;

        manager.batchRelease(streams);

        uint256 balance1 = msAddr1.balance;
        uint256 nextMs1 = ms1.nextPayment();
        uint256 recBal1 = address(receiver).balance;
        uint256 botBal1 = address(bot).balance;

        assertEq(balance1, 8e18);
        assertEq(nextMs1, 0);
        assertEq(recBal1, 199e16);
        assertEq(botBal1, 1e16);

        vm.warp(block.timestamp + 2 weeks);
        manager.batchRelease(streams);

        uint256 balance2 = msAddr1.balance;
        uint256 nextMs2 = ms1.nextPayment();
        uint256 recBal2 = address(receiver).balance;
        uint256 botBal2 = address(bot).balance;

        assertEq(balance2, 6e18);
        assertEq(nextMs2, 0);
        assertEq(recBal2, 398e16);
        assertEq(botBal2, 2e16);

        vm.warp(block.timestamp + 4 weeks);
        manager.batchRelease(streams);

        uint256 balance3 = msAddr1.balance;
        uint256 nextMs3 = ms1.nextPayment();
        uint256 recBal3 = address(receiver).balance;
        uint256 botBal3 = address(bot).balance;

        assertEq(balance3, 2e18);
        assertEq(nextMs3, 0);
        assertEq(recBal3, 797e16);
        assertEq(botBal3, 3e16);

        // Ensure you can claim stream past end date
        vm.warp(block.timestamp + 3 weeks);
        manager.batchRelease(streams);

        uint256 balance4 = msAddr1.balance;
        vm.expectRevert(abi.encodeWithSignature("STREAM_FINISHED()"));
        ms1.nextPayment();
        uint256 recBal4 = address(receiver).balance;
        uint256 botBal4 = address(bot).balance;

        assertEq(balance4, 0);
        assertEq(recBal4, 996e16);
        assertEq(botBal4, 4e16);

        vm.warp(block.timestamp + 2 weeks);
        vm.expectRevert(abi.encodeWithSignature("STREAM_FINISHED()"));
        manager.batchRelease(streams);
    }
}
