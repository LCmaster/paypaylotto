import React, { useContext } from "react";
import { GiTicket } from "react-icons/gi";
import AppContext from "../../../../context/AppContext";

import "./LotteryTicketControls.css";

function LotteryTicketControls() {
  const {
    state: { lottery },
    onBuyTicket,
  } = useContext(AppContext);

  return (
    <div className="tickets__controllers">
      <button disabled={lottery?.status !== 1} onClick={() => onBuyTicket(1)}>
        <GiTicket /> 1
      </button>
      <button disabled onClick={() => onBuyTicket(10)}>
        <GiTicket /> 10
      </button>
      <button disabled onClick={() => onBuyTicket(100)}>
        <GiTicket /> 100
      </button>
      <button disabled onClick={() => onBuyTicket(1000)}>
        <GiTicket /> 1000
      </button>
    </div>
  );
}

export default LotteryTicketControls;
