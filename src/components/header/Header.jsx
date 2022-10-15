import React, { useContext } from "react";

import { GiTwoCoins } from "react-icons/gi";
import Web3Context from "../../context/Web3Context";

import "./Header.css";

function Header() {
  const { account } = useContext(Web3Context);

  return (
    <header className="header">
      <div className="header__heading">
        <GiTwoCoins size={48} />
        <h1>Pay Pay Lotto</h1>
      </div>

      {!!account ? (
        <div className="account">
          {`${account.slice(0, 5 + 2)}...${account.slice(-3)}`}
        </div>
      ) : (
        <div></div>
      )}
    </header>
  );
}

export default Header;
