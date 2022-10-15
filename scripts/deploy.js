// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const Token = await hre.ethers.getContractFactory("PayPayToken");
  const token = await Token.deploy();
  await token.deployed();

  const Ticket = await hre.ethers.getContractFactory("PayPayTicket");
  const ticket = await Ticket.deploy();
  await ticket.deployed();

  const Lottery = await hre.ethers.getContractFactory("PayPayLottery");
  const lottery = await Lottery.deploy();
  await lottery.deployed();

  const tx = await ticket.transferOwnership(lottery.address);
  await tx.wait();

  // console.log(`Token deployed to ${token.address}`);
  // console.log(`Ticket deployed to ${ticket.address}`);
  // console.log(`Lottery deployed to ${lottery.address}`);
  const contracts = {
    token: token.address,
    ticket: ticket.address,
    lottery: lottery.address,
  };

  let data = JSON.stringify(contracts, null, 2);
  fs.writeFileSync("./src/contracts.json", data);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
