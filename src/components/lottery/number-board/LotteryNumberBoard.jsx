import React, { useContext } from "react";
import PropTypes from "prop-types";

import "./LotteryNumberBoard.css";
import LotteryNumber from "../number/LotteryNumber";
import LotteryContext from "../../../context/LotteryContext";

const MIN = 1;
const MAX = 60;

// const randomIntFromInterval = () =>
//   Math.floor(Math.random() * (MAX - MIN + 1) + MIN);

function LotteryNumberBoard({ pickedNumbers }) {
  const { lottery } = useContext(LotteryContext);

  let numbersList = [];
  for (let i = 0; i < MAX; i++) {
    numbersList.push(i + MIN);
  }

  return (
    <div className="lottery__number-board">
      {numbersList.map((entry, index) => (
        <LotteryNumber
          key={index}
          number={entry}
          picked={"winningNumbers" in lottery && lottery.winningNumbers[index]}
        />
      ))}
    </div>
  );
}

LotteryNumberBoard.propTypes = {
  pickedNumbers: PropTypes.array,
};

LotteryNumberBoard.defaultProps = {
  pickedNumbers: [],
};

export default LotteryNumberBoard;
