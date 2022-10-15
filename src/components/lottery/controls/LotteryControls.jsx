import React, { useContext } from "react";
import LotteryContext from "../../../context/LotteryContext";
import "./LotteryControls.css";

function LotteryControls() {
  const { lottery, onStartNewLottery, onCloseLottery, onDrawNumber } =
    useContext(LotteryContext);

  return (
    <div className="lottery__controllers">
      <button disabled={lottery?.id > 0} onClick={onStartNewLottery}>
        Start New Lottery
      </button>

      <button disabled={lottery?.status !== 1} onClick={onCloseLottery}>
        Close Lottery
      </button>
      <button disabled={lottery?.status !== 2} onClick={onDrawNumber}>
        Draw a Number
      </button>
    </div>
  );
}

export default LotteryControls;
