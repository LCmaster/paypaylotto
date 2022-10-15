import React, { useContext } from "react";
import LotteryTicket from "../ticket/LotteryTicket";
import AppContext from "../../../../context/AppContext";

import "./LotteryTicketList.css";

function LotteryTicketList() {
  const {
    state: { lottery },
  } = useContext(AppContext);

  return (
    <div className="ticket__list">
      <h3>Tickets List</h3>
      <ul className="tickets">
        {lottery?.tickets
          ?.map((entry) => {
            return {
              id: entry.id,
              points: entry.numbers.reduce(
                (prev, curr) =>
                  prev + (lottery.winningNumbers[curr - 1] ? 1 : 0),
                0
              ),
              numbers: entry.numbers,
            };
          })
          .sort((a, b) => {
            return a.points - b.points;
          })
          .reverse()
          .map((entry) => {
            return (
              <li className="ticket__item" key={entry.id}>
                <LotteryTicket
                  id={entry.id}
                  lottery={lottery}
                  numbers={entry.numbers}
                  points={entry.points}
                />
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default LotteryTicketList;
