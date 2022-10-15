import { ethers } from "ethers";
import { createContext, useEffect, useState } from "react";

import TokenContract from "../artifacts/contracts/PayPayToken.sol/PayPayToken.json";
import TicketContract from "../artifacts/contracts/PayPayTicket.sol/PayPayTicket.json";
import LotteryContract from "../artifacts/contracts/PayPayLottery.sol/PayPayLottery.json";

import contracts from "../contracts.json";

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState({
    account: "",
    provider: {},
    tokenContract: {},
    ticketContract: {},
    lotteryContract: {},
  });

  useEffect(() => {
    if (web3.account !== "") return;

    async function updateWeb3() {
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
      await ethersProvider.send("eth_requestAccounts", []);
      const signer = ethersProvider.getSigner();
      const currentAccount = await signer.getAddress();

      const token = new ethers.Contract(
        contracts.token,
        TokenContract.abi,
        signer
      );
      const ticket = new ethers.Contract(
        contracts.ticket,
        TicketContract.abi,
        signer
      );
      const lottery = new ethers.Contract(
        contracts.lottery,
        LotteryContract.abi,
        signer
      );

      return {
        account: currentAccount,
        provider: ethersProvider,
        tokenContract: token,
        ticketContract: ticket,
        lotteryContract: lottery,
      };
    }
    updateWeb3().then(setWeb3);
    // const filter = web3.lotteryContract.filters.TicketBought();

    return function cleanup() {
      // if (web3) {
      //   if (
      //     web3.tokenContract &&
      //     typeof web3.tokenContract.removeAllListeners === "function"
      //   ) {
      //     web3.tokenContract.removeAllListeners();
      //   }
      //   if (
      //     web3.ticketContract &&
      //     typeof web3.ticketContract.removeAllListeners === "function"
      //   ) {
      //     web3.ticketContract.removeAllListeners();
      //   }
      //   if (
      //     web3.lotteryContract &&
      //     typeof web3.lotteryContract.removeAllListeners === "function"
      //   ) {
      //     web3.lotteryContract.removeAllListeners();
      //   }
      // }
    };
  }, [web3]);

  return (
    <>
      {web3.account ? (
        <Web3Context.Provider value={web3}>{children}</Web3Context.Provider>
      ) : (
        <div className="auth-guard">You need MetaMask to run this app.</div>
      )}
    </>
  );
};

export default Web3Context;
