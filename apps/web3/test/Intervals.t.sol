// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.17;

import "forge-std/console2.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { NounsStreamTest } from "./utils/NounsStreamTest.sol";

import { Intervals } from "../src/intervals/Intervals.sol";
import { IIntervals } from "../src/intervals/interfaces/IIntervals.sol";

import { MockImpl } from "./mocks/MockImpl.sol";

contract IntervalsTest is NounsStreamTest {
    MockImpl internal mockImpl;

    address internal builderDAO;

    function setUp() public virtual override {
        super.setUp();
        mockImpl = new MockImpl();
        deployManagerMock();
    }

    function test_Withdraw() public {
        vm.prank(owner);

        deal(address(intervals), 20e18);

        uint256 curBal = address(intervals).balance;
        assertEq(curBal, 20e18);

        intervals.withdraw();

        uint256 nexBal = address(intervals).balance;
        assertEq(nexBal, 0);

        uint256 owBal = address(owner).balance;
        assertEq(owBal, 20e18);
    }

    function test_CannotWithdraw() public {
        deal(address(intervals), 20e18);

        vm.expectRevert(abi.encodeWithSignature("ONLY_OWNER()"));
        intervals.withdraw();
    }

    function test_Claim() public {
        vm.prank(owner);

        deal(address(intervals), owed * 4);

        uint256 paidBal = intervals.claim();
        uint256 nextMs = intervals.nextPayment();
        uint256 balance = address(intervals).balance;
        uint256 recBal = address(receiver).balance;

        assertEq(nextMs, 0);
        assertEq(paidBal, 2e18);
        assertEq(balance, 6e18);
        assertEq(recBal, 2e18);
    }

    function test_ClaimERC20() public {
        IIntervals intv = intList[2];

        uint256 paidBal = intv.claim();
        uint256 nextMs = intv.nextPayment();
        uint256 balance = intv.balance();
        uint256 recBal = erc20.balanceOf(address(receiver));

        assertEq(nextMs, 0);
        assertEq(paidBal, 2e18);
        assertEq(balance, 6e18);
        assertEq(recBal, 2e18);
    }

    function test_ClaimNotStarted() public {
        vm.prank(owner);
        IIntervals intvl1 = intList[1];

        deal(address(intvl1), 30e18);

        vm.expectRevert(abi.encodeWithSignature("STREAM_HASNT_STARTED()"));
        intvl1.claim();
    }

    function test_Release() public {
        deal(address(intervals), owed * 4);

        intervals.release();

        uint256 nextMs = intervals.nextPayment();
        uint256 balance = address(intervals).balance;
        uint256 recBal = address(receiver).balance;
        uint256 botBal = address(bot).balance;

        assertEq(nextMs, 0);
        assertEq(balance, 6e18);
        assertEq(recBal, 199e16);
        assertEq(botBal, 1e16);
    }

    function test_ReleaseERC20() public {
        IIntervals intv = intList[2];
        intv.release();

        uint256 nextMs = intv.nextPayment();
        uint256 balance = intv.balance();
        uint256 recBal = erc20.balanceOf(address(receiver));
        uint256 botBal = erc20.balanceOf(address(bot));

        assertEq(nextMs, 0);
        assertEq(balance, 6e18);
        assertEq(recBal, 199e16);
        assertEq(botBal, 1e16);
    }

    function test_ReleaseNoFunds() public {
        IIntervals intvl1 = intList[1];

        deal(address(intvl1), 30e18);

        vm.expectRevert(abi.encodeWithSignature("STREAM_HASNT_STARTED()"));
        intvl1.release();
    }

    function test_PauseIntervals() public {
        vm.prank(owner);
        intervals.pause();

        vm.expectRevert(abi.encodeWithSignature("PAUSED()"));
        intervals.claim();
    }

    function test_OnlyOwnerPauseIntervals() public {
        vm.expectRevert(abi.encodeWithSignature("ONLY_OWNER()"));
        intervals.pause();
    }

    function test_UnPauseIntervals() public {
        deal(address(intervals), 30e18);
        vm.prank(owner);
        intervals.pause();
        vm.prank(owner);
        intervals.unpause();

        intervals.claim();
    }

    function test_GetCurrentInterval() public {
        (uint64 _startDate, uint64 _endDate, uint32 _interval, uint96 _tip, uint256 _owed, uint256 _paid, address _recipient) = intervals
            .getCurrentInterval();

        assertEq(_startDate, startDate);
        assertEq(_endDate, endDate);
        assertEq(_interval, interval);
        assertEq(_tip, tip);
        assertEq(_owed, owed);
        assertEq(_paid, startDate);
        assertEq(_recipient, receiver);
    }
}
