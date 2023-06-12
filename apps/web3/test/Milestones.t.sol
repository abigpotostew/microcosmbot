// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.17;
import "forge-std/console2.sol";

import { NounsStreamTest } from "./utils/NounsStreamTest.sol";

import { Milestones } from "../src/milestones/Milestones.sol";
import { IMilestones } from "../src/milestones/interfaces/IMilestones.sol";

import { MockImpl } from "./mocks/MockImpl.sol";

contract MilestonesTest is NounsStreamTest {
    MockImpl internal mockImpl;

    address internal builderDAO;

    function setUp() public virtual override {
        super.setUp();
        mockImpl = new MockImpl();
        deployManagerMock();
    }

    function test_NextMilestones() public {
        uint256 balance = milestones.nextPayment();

        assertEq(balance, 3e18);
    }

    function test_Deposit() public {
        deal(address(owner), 20e18);
        vm.prank(owner);
        payable(address(milestones)).transfer(3e18);
        assertEq(address(milestones).balance, 3e18);
    }

    function test_Withdraw() public {
        vm.prank(owner);

        deal(address(milestones), 20e18);

        uint256 curBal = address(milestones).balance;
        assertEq(curBal, 20e18);

        milestones.withdraw();

        uint256 nexBal = address(milestones).balance;
        assertEq(nexBal, 0);

        uint256 owBal = address(owner).balance;
        assertEq(owBal, 20e18);
    }

    function test_CannotWithdraw() public {
        deal(address(milestones), 20e18);

        vm.expectRevert(abi.encodeWithSignature("ONLY_OWNER()"));
        milestones.withdraw();
    }

    function test_Claim() public {
        vm.prank(owner);

        deal(address(milestones), 30e18);

        uint256 paidBal = milestones.claim();
        uint256 nextMs = milestones.nextPayment();
        uint256 balance = address(milestones).balance;
        uint256 recBal = address(receiver).balance;

        assertEq(nextMs, 2e18);
        assertEq(paidBal, 3e18);
        assertEq(balance, 27e18);
        assertEq(recBal, 3e18);
    }

    function test_ClaimERC20() public {
        IMilestones ms = msList[2];

        uint256 paidBal = ms.claim();
        uint256 nextMs = ms.nextPayment();
        uint256 balance = ms.balance();
        uint256 recBal = erc20.balanceOf(address(receiver));

        assertEq(nextMs, 2e18);
        assertEq(paidBal, 3e18);
        assertEq(balance, 27e18);
        assertEq(recBal, 3e18);
    }

    function test_ClaimNoFunds() public {
        vm.prank(owner);
        IMilestones mil1 = msList[1];

        deal(address(mil1), 30e18);

        uint256 funds = mil1.claim();
        assertEq(funds, 0);
    }

    function test_Release() public {
        deal(address(milestones), 30e18);

        milestones.release();

        uint256 nextMs = milestones.nextPayment();
        uint256 balance = address(milestones).balance;
        uint256 recBal = address(receiver).balance;
        uint256 botBal = address(bot).balance;

        assertEq(nextMs, 2e18);
        assertEq(balance, 27e18);
        assertEq(recBal, 299e16);
        assertEq(botBal, 1e16);
    }

    function test_ReleaseERC20() public {
        IMilestones ms = msList[2];
        ms.release();

        uint256 nextMs = ms.nextPayment();
        uint256 balance = ms.balance();
        uint256 recBal = erc20.balanceOf(address(receiver));
        uint256 botBal = erc20.balanceOf(address(bot));

        assertEq(nextMs, 2e18);
        assertEq(balance, 27e18);
        assertEq(recBal, 299e16);
        assertEq(botBal, 1e16);
    }

    function test_ReleaseNoFunds() public {
        IMilestones mil1 = msList[1];

        deal(address(mil1), 30e18);

        uint256 funds = mil1.release();
        assertEq(funds, 0);
    }

    function test_PauseMilestones() public {
        vm.prank(owner);
        milestones.pause();

        vm.expectRevert(abi.encodeWithSignature("PAUSED()"));
        milestones.claim();
    }

    function test_OnlyOwnerPauseMilestones() public {
        vm.expectRevert(abi.encodeWithSignature("ONLY_OWNER()"));
        milestones.pause();
    }

    function test_UnPauseMilestones() public {
        deal(address(milestones), 30e18);
        vm.prank(owner);
        milestones.pause();
        vm.prank(owner);
        milestones.unpause();

        milestones.claim();
    }

    function test_GetCurrentMilestone() public {
        vm.prank(owner);

        (uint256 _payment, uint64 _date) = milestones.getMilestone(0);
        (uint256 _paymentLength, uint256 _dateLength) = milestones.getMilestoneLength();
        (uint48 _currentMilesonte, uint256 _paymentC, uint64 _dateC, uint96 _tip, address _recipient) = milestones.getCurrentMilestone();

        assertEq(_payment, msPayments1[0]);
        assertEq(_date, msDates1[0]);
        assertEq(_paymentLength, 3);
        assertEq(_dateLength, 3);
        assertEq(_currentMilesonte, 0);
        assertEq(_paymentC, msPayments1[0]);
        assertEq(_dateC, msDates1[0]);
        assertEq(_tip, tip);
        assertEq(_recipient, receiver);
    }

    function test_ChangeRecipient() public {
        vm.prank(receiver);
        milestones.changeRecipient(owner);

        (uint48 _currentMilesonte, uint256 _paymentC, uint64 _dateC, uint96 _tip, address _recipient) = milestones.getCurrentMilestone();

        assertEq(_currentMilesonte, 0);
        assertEq(_paymentC, msPayments1[0]);
        assertEq(_dateC, msDates1[0]);
        assertEq(_tip, tip);
        assertEq(_recipient, owner);
    }

    function test_ChangeRecipientRevert() public {
        vm.expectRevert(abi.encodeWithSignature("ONLY_RECIPIENT()"));
        milestones.changeRecipient(owner);

        (uint48 _currentMilesonte, uint256 _paymentC, uint64 _dateC, uint96 _tip, address _recipient) = milestones.getCurrentMilestone();

        assertEq(_currentMilesonte, 0);
        assertEq(_paymentC, msPayments1[0]);
        assertEq(_dateC, msDates1[0]);
        assertEq(_tip, tip);
        assertEq(_recipient, receiver);
    }
}
