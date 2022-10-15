import React, { useContext } from "react";

import Header from "./components/header/Header";
import AccountInfos from "./components/account/AccountInfos";
import LotteryPage from "./pages/lottery/LotteryPage";

import "./App.css";
import AppContext from "./context/AppContext";

export default function App() {
  const { state } = useContext(AppContext);
  return (
    <div className="app">
      <Header account={state?.account?.address} />
      <AccountInfos balance={state?.account?.balance} />
      <LotteryPage />
    </div>
  );
}
