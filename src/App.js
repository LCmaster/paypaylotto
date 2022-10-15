import React from "react";

import { Web3Provider } from "./context/Web3Context";

import Header from "./components/header/Header";
import AccountInfos from "./components/account/AccountInfos";
import LotteryPage from "./pages/lottery/LotteryPage";

import "./App.css";

export default function App() {
  return (
    <div className="app">
      <Web3Provider>
        <Header />
        <AccountInfos />
        <LotteryPage />
      </Web3Provider>
    </div>
  );
}
