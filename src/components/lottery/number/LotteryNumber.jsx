import React from "react";
import "./LotteryNumber.css";

function LotteryNumber({ number, picked }) {
  return (
    <div className={`lottery__number ${picked && "lottery__number--picked"}`}>
      {number < 10 ? `0${number}` : number}
    </div>
  );
}

export default LotteryNumber;
