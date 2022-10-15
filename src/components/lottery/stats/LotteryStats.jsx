import React, { useContext } from "react";
import LotteryContext from "../../../context/LotteryContext";
import Indicator from "../../indicator/Indicator";

import "./LotteryStats.css";

function LotteryStats() {
  const { lottery } = useContext(LotteryContext);

  return (
    <div className="lotter__stats">
      <div className="indicators">
        <Indicator title={"ID"}>
          <span>#</span>
          <span>{!lottery ? "-" : lottery.id}</span>
        </Indicator>
        <Indicator title={"Tickets Sold"}>
          <span>#</span>
          <span>{!lottery ? "-" : 0}</span>
        </Indicator>
        <Indicator title={"Prize"}>
          <span>$</span>
          <span>{!lottery ? "-" : 0}</span>
        </Indicator>
        <Indicator title={"Dev Team"}>
          <span>$</span>
          <span>{!lottery ? "-" : 0}</span>
        </Indicator>
      </div>
    </div>
  );
}

export default LotteryStats;
