import React, { useContext } from "react";
import AppContext from "../../../context/AppContext";
import "./LotteryControls.css";

function LotteryControls() {
  const { state, onStartNewLottery, onCloseLottery, onDrawNumber } =
    useContext(AppContext);

  return (
    <div className="lottery__controllers">
      <button disabled={state?.lottery?.id > 0} onClick={onStartNewLottery}>
        Start New Lottery
      </button>

      <button disabled={state?.lottery?.status !== 1} onClick={onCloseLottery}>
        Close Lottery
      </button>
      <button disabled={state?.lottery?.status !== 2} onClick={onDrawNumber}>
        Draw a Number
      </button>
    </div>
  );
}

export default LotteryControls;
