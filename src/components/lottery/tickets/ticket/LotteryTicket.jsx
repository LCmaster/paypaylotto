import React from "react";
import LotteryNumber from "../../number/LotteryNumber";
import "./LotteryTicket.css";

function LotteryTicket({ id, lottery, numbers, points }) {
  return (
    <div className="ticket__card">
      <h4 className="ticket__title">
        <span className="id">{`${id.slice(0, 5)}...${id.slice(-5)}`}</span>
        <span className="points">{points}</span>
      </h4>
      <ul className="ticket__numbers">
        {numbers.map((entry) => (
          <li
            className={`number ${
              lottery.winningNumbers[entry - 1] && "picked"
            }`}
            key={entry}
          >
            {entry < 10 ? `0${entry}` : entry}
          </li>
        ))}
      </ul>
      <div className="action">
        <button disabled={points < 20}>Redeem</button>
      </div>
    </div>
  );
}

export default LotteryTicket;
