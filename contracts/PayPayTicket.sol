// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PayPayTicket is ERC1155, ERC1155Burnable, Ownable {
    bytes private EMPTY;

    struct TicketInfo {
        address owner;
        uint[20] numbers;
        bool claimed;
        uint256 lotteryId;
    }

    // ticket ID => ticket infos
    mapping(uint256 => TicketInfo) private ticketInfo_;
    // owner => lottery => ticket IDs
    mapping(address => mapping(uint256 => uint[])) private tickets_;
    // lottery => number => ticket IDs
    mapping(uint256 => mapping(uint256 => uint256[])) private ticketsByNumber_;
    // lottery => ticket ID => points
    mapping(uint256 => mapping(uint256 => uint256)) pointsByTicket_;

    constructor() ERC1155("") {}

    function tickets(address account, uint256 lotteryId)
        public
        view
        returns (uint[] memory)
    {
        return tickets_[account][lotteryId];
    }

    function ticketInfo(uint id) public view returns (TicketInfo memory) {
        return ticketInfo_[id];
    }

    function checkForWinningTickets(uint256 lottery, uint256[] memory numbers)
        public
        onlyOwner
        returns (uint256[] memory)
    {
        for (uint i = 0; i < numbers.length; i++) {
            uint256[] memory ids = ticketsByNumber_[lottery][numbers[i]];
            for (uint j = 0; j < ids.length; j++) {
                pointsByTicket_[lottery][ids[i]] += 1;
            }
        }

        uint256[] memory winners;
        for (uint i = 0; i < numbers.length; i++) {
            uint256[] memory ids = ticketsByNumber_[lottery][numbers[i]];
            for (uint j = 0; j < ids.length; j++) {
                if (pointsByTicket_[lottery][ids[i]] >= 20) {
                    winners[winners.length] = ids[i];
                }
            }
        }
        return winners;
    }

    function mint(address account, uint256 id) public onlyOwner {
        require(
            !ticketInfo_[id].claimed && ticketInfo_[id].owner == address(0),
            "This ticket has already been claimed!"
        );

        uint256 idChain = id;
        uint[20] memory numbers;

        for (uint i = 0; i < 20; i++) {
            uint8 number = uint8(idChain % 100);
            idChain = idChain / 100;
            require(number > 0, "Can't choose zero!");
            numbers[i] = number;
        }

        _mint(account, id, 1, EMPTY);

        TicketInfo memory info = TicketInfo({
            owner: account,
            lotteryId: idChain,
            claimed: true,
            numbers: numbers
        });
        ticketInfo_[id] = info;

        tickets_[account][idChain].push(id);

        for (uint i = 0; i < 20; i++) {
            ticketsByNumber_[idChain][numbers[i]].push(id);
        }
    }

    function mintBatch(address to, uint256[] memory ids) public onlyOwner {
        for (uint i = 0; i < ids.length; i++) {
            mint(to, ids[i]);
        }
    }
}
