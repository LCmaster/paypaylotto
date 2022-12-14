import React from "react";
import LotteryControls from "../../components/lottery/controls/LotteryControls";
import LotteryNumberBoard from "../../components/lottery/number-board/LotteryNumberBoard";
import LotteryTicketControls from "../../components/lottery/tickets/controls/LotteryTicketControls";
import LotteryTicketList from "../../components/lottery/tickets/list/LotteryTicketList";
import "./LotteryPage.css";

function LotteryPage() {
  return (
    <div className="lottery__page">
      <LotteryControls />
      <LotteryNumberBoard />
      <LotteryTicketControls />
      <LotteryTicketList />
    </div>
  );
}

export default LotteryPage;
