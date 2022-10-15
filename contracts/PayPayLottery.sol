// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {PayPayToken} from "./PayPayToken.sol";
import {PayPayTicket} from "./PayPayTicket.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract PayPayLottery is Ownable {
    enum Status {
        NotStarted,
        Open,
        Closed,
        Completed
    }

    struct LotteryInfo {
        uint256 id;
        Status status;
        uint256 prizePool;
        uint256 ticketPrice;
        uint256 feePerTicket;
        uint256 refundableAmount;
        uint256 startingAt;
        uint256 closingAt;
        bool[60] winningNumbers;
    }

    mapping(uint256 => LotteryInfo) private lottery;

    // ========== EVENTS ==========
    event NumberDrawn(uint256 lotteryId, uint256 number);

    event LotteryOpen(uint256 lotteryId);
    event LotteryClose(uint256 lotteryId);
    event LotteryCompleted(uint256 lotteryId);

    event TicketBought(
        uint256 indexed lotteryId,
        uint256 indexed ticketId,
        address indexed owner
    );

    uint256 public currentLotteryId = 0;

    // constructor() {}

    function getLottery(uint256 id) public view returns (LotteryInfo memory) {
        require(id > 0, "PayPayLottery: Invalid ID.");
        require(currentLotteryId > 0, "PayPayLottery: No lottery opened yet.");
        return lottery[id];
    }

    function startLottery() public onlyOwner returns (uint256) {
        require(
            currentLotteryId == 0 ||
                lottery[currentLotteryId].status == Status.Completed,
            "PayPayLottery: The previous lottery must be completed before starting a new one!"
        );

        currentLotteryId += 1;
        lottery[currentLotteryId].id = currentLotteryId;
        lottery[currentLotteryId].status = Status.Open;
        lottery[currentLotteryId].ticketPrice = 10;
        lottery[currentLotteryId].feePerTicket = 2;
        lottery[currentLotteryId].refundableAmount = 3;
        lottery[currentLotteryId].startingAt = block.timestamp;
        lottery[currentLotteryId].closingAt = block.timestamp + 5 minutes;
        emit LotteryOpen(currentLotteryId);

        return currentLotteryId;
    }

    function closeLottery() public onlyOwner {
        require(currentLotteryId > 0, "PayPayLottery: No lottery opened yet.");
        require(
            lottery[currentLotteryId].status == Status.Open,
            "PayPayLottery: The lottery must be open before being closed."
        );

        lottery[currentLotteryId].status = Status.Closed;
        emit LotteryClose(currentLotteryId);
    }

    function drawNumber(uint256 number) public onlyOwner {
        require(currentLotteryId > 0, "PayPayLottery: No lottery opened yet.");
        require(
            lottery[currentLotteryId].status == Status.Closed,
            "PayPayLottery: The lottery must be closed before the numbers can be drawn."
        );
        require(
            !lottery[currentLotteryId].winningNumbers[number - 1],
            "PayPayLottery: This number was already picked! Try another one."
        );
        lottery[currentLotteryId].winningNumbers[number - 1] = true;
        emit NumberDrawn(currentLotteryId, number);
    }

    function getCurrentLottery() public view returns (LotteryInfo memory) {
        require(currentLotteryId > 0, "PayPayLottery: No lottery opened yet.");
        return lottery[currentLotteryId];
    }

    function buyTicket(
        address payable _token,
        address _ticket,
        uint256 ticketId
    ) public payable {
        require(currentLotteryId > 0, "PayPayLottery: No lottery opened yet.");
        require(
            lottery[currentLotteryId].status == Status.Open,
            "PayPayLottery: Tickets can only be bought while the lottery is open."
        );

        PayPayToken token = PayPayToken(_token);
        PayPayTicket ticket = PayPayTicket(_ticket);
        token.transferFrom(
            msg.sender,
            address(this),
            lottery[currentLotteryId].ticketPrice
        );
        ticket.mint(msg.sender, ticketId);

        emit TicketBought(currentLotteryId, ticketId, msg.sender);
    }
}
