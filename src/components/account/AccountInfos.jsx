import React, { useContext, useState } from "react";
import { ethers } from "ethers";

import { FaCoins } from "react-icons/fa";
import Web3Context from "../../context/Web3Context";

// import Indicator from "../indicator/Indicator";

import "./AccountInfos.css";
import { result } from "lodash";

function AccountInfos() {
  const { account, provider, tokenContract } = useContext(Web3Context);

  const [balance, setBalance] = useState();

  const updateBalance = () => {
    tokenContract.balanceOf(account).then((accountBalance) => {
      const actualBalance = ethers.utils.formatUnits(accountBalance, "wei");
      setBalance(actualBalance);
    });
  };

  const buyTokens = async (input) => {
    const options = {
      to: tokenContract.address,
      value: ethers.utils.parseUnits(input, "finney"),
    };

    const signer = provider.getSigner();

    signer.sendTransaction(options).then((tx) => {
      tx.wait().then((receipt) => {
        updateBalance();
      });
    });
  };

  useState(() => {
    updateBalance();
  }, [account]);

  return (
    <div className="account__infos">
      <div className="token__actions">
        <button className="token__buy-btn" onClick={() => buyTokens("10")}>
          <FaCoins /> 10
        </button>
        <button className="token__buy-btn" onClick={() => buyTokens("100")}>
          <FaCoins /> 100
        </button>
        <button className="token__buy-btn" onClick={() => buyTokens("1000")}>
          <FaCoins /> 1000
        </button>
      </div>
      <div className="account__balance">
        <span className="token__symbol">
          <FaCoins />
        </span>
        <span className="token__amount">{balance ? balance : 0}</span>
      </div>
    </div>
  );
}

export default AccountInfos;
