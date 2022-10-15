import React, { useContext } from "react";
import PropTypes from "prop-types";

import "./LotteryNumberBoard.css";
import LotteryNumber from "../number/LotteryNumber";
import AppContext from "../../../context/AppContext";

const MIN = 1;
const MAX = 60;

function LotteryNumberBoard({ pickedNumbers }) {
  const {
    state: { lottery },
  } = useContext(AppContext);

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
          picked={
            lottery && lottery?.winningNumbers && lottery.winningNumbers[index]
          }
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
