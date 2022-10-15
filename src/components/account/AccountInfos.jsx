import React, { useContext, useState } from "react";
import { ethers } from "ethers";

import { FaCoins } from "react-icons/fa";

import "./AccountInfos.css";
import AppContext from "../../context/AppContext";

function AccountInfos({ balance }) {
  const { state, onBuyToken } = useContext(AppContext);

  return (
    <div className="account__infos">
      <div className="token__actions">
        <button className="token__buy-btn" onClick={() => onBuyToken("10")}>
          <FaCoins /> 10
        </button>
        <button className="token__buy-btn" onClick={() => onBuyToken("100")}>
          <FaCoins /> 100
        </button>
        <button className="token__buy-btn" onClick={() => onBuyToken("1000")}>
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
