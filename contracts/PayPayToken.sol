// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PayPayToken is ERC20 {
    constructor() ERC20("PayPayToken", "PPTKN") {
        _mint(msg.sender, 1000000);
    }

    function buy() public payable {
        require(msg.value >= 10**15, "Not enough money to buy tokens eh.");
        _mint(msg.sender, msg.value / 10**15);
    }

    receive() external payable {
        buy();
    } // to support receiving ETH by default

    fallback() external payable {}
}
