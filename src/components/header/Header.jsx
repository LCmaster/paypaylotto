import React, { useContext } from "react";

import { GiTwoCoins } from "react-icons/gi";

import "./Header.css";

function Header({ account }) {
  return (
    <header className="header">
      <div className="header__heading">
        <GiTwoCoins size={48} />
        <h1>Pay Pay Lotto</h1>
      </div>

      {account && (
        <div className="account">
          {`${account.slice(0, 5 + 2)}...${account.slice(-3)}`}
        </div>
      )}
    </header>
  );
}

export default Header;
