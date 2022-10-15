import { BigNumber } from "ethers";
import { createContext, useContext, useEffect, useState } from "react";
import Web3Context from "./Web3Context";

const LotteryContext = createContext();

function isLotteryEqual(lotto1, lotto2) {
  return (
    lotto1.id === lotto2.id &&
    lotto1.status === lotto2.status &&
    lotto1.ticketPrice === lotto2.ticketPrice &&
    lotto1.startingAt === lotto2.startingAt &&
    lotto1.closingAt === lotto2.closingAt &&
    lotto1.winningNumbers.every(
      (val, index) => val == lotto2.winningNumbers[index]
    )
  );
}

function randomInt() {
  return Math.floor(Math.random() * 60 + 1);
}

function generateTicketId(lotteryId) {
  let numbers = [];
  while (numbers.length < 20) {
    let randomNumber = randomInt();
    while (numbers.includes(randomNumber)) {
      randomNumber = randomInt();
    }
    numbers.push(randomNumber);
  }

  numbers = numbers.sort((a, b) => a - b).reverse();

  let ticketId = `${lotteryId}`;
  for (let i = 0; i < numbers.length; i++) {
    ticketId += numbers[i] < 10 ? "0" + numbers[i] : numbers[i];
  }

  return ticketId;
}

const getNumbersFromId = (id) => {
  const numbers = [];

  let chainId = id;

  for (let i = 0; i < 20; i++) {
    const index = id.length - 2 * (i + 1);
    let number = parseInt(chainId.slice(index, index + 2));
    numbers.push(number);
  }

  return numbers;
};

export const LotteryProvider = ({ children }) => {
  const { account, tokenContract, ticketContract, lotteryContract } =
    useContext(Web3Context);

  const [lottery, setLottery] = useState({});
  const [tickets, setTickets] = useState([]);

  const updateLottery = () => {
    lotteryContract.getCurrentLottery().then((remote) => {
      const current = {
        id: remote.id.toNumber(),
        status: remote.status,
        prizePool: remote.prizePool.toNumber(),
        ticketPrice: remote.ticketPrice.toNumber(),
        feePerTicket: remote.feePerTicket.toNumber(),
        startingAt: remote.startingAt.toNumber(),
        closingAt: remote.closingAt.toNumber(),
        winningNumbers: remote.winningNumbers,
      };

      if (!isLotteryEqual(lottery, current)) setLottery(current);
    });
  };

  const startNewLottery = async () => {
    const tx = await lotteryContract.startLottery();
    await tx.wait();
    updateLottery();
  };

  const updateTicketList = () => {
    if (lottery.id > 0) {
      ticketContract.tickets(account, lottery.id).then((ticketsIds) => {
        setTickets(() =>
          ticketsIds
            .map((entry) => entry.toString())
            .map((entry) => {
              return { id: entry, numbers: getNumbersFromId(entry) };
            })
        );
      });
    }
  };

  const buyTicket = async (amount) => {
    const approveTx = await tokenContract.approve(
      lotteryContract.address,
      lottery.ticketPrice
    );
    await approveTx.wait();

    const ticketId = generateTicketId(lottery.id);
    console.log("Trying to buy ticket: " + ticketId);
    const buytTicketTx = await lotteryContract.buyTicket(
      tokenContract.address,
      ticketContract.address,
      ticketId
    );
    await buytTicketTx.wait();
    console.log("Ticket " + ticketId + " bought!");
    updateTicketList();
  };

  const closeLottery = async () => {
    await lotteryContract.closeLottery().then((tx) => {
      tx.wait().then(() => {
        updateLottery();
      });
    });
  };

  const drawLotteryNumber = () => {
    if ("winningNumbers" in lottery) {
      let pickedNumbers = [];
      for (let i = 0; i < lottery.winningNumbers.length; i++) {
        if (lottery.winningNumbers[i]) {
          pickedNumbers.push(i + 1);
        }
      }

      let randomNumber;
      while (true) {
        randomNumber = randomInt();
        if (!pickedNumbers.includes(randomNumber)) break;
      }

      // console.log("Trying to draw number: " + randomNumber);

      lotteryContract.drawNumber(randomNumber).then((tx) => {
        tx.wait().then(() => {
          // console.log("Number drawn: " + randomNumber);
          updateLottery();
          pickedNumbers.push(randomNumber);
          pickedNumbers = pickedNumbers.sort((a, b) => a - b);

          if (pickedNumbers.length >= 20) {
            const filter = lotteryContract.filters.TicketBought(lottery.id);
            lotteryContract.queryFilter(filter).then((eventArray) => {
              const winners = eventArray
                .map((eventObj) => {
                  const ticketId = eventObj.args.ticketId.toString();
                  const ticketNumbers = getNumbersFromId(ticketId);
                  const ticketPoints = ticketNumbers.reduce(
                    (prev, curr) =>
                      prev + (pickedNumbers.includes(curr) ? 1 : 0),
                    0
                  );
                  return { ticketId, ticketPoints };
                })
                .filter((entry) => entry.ticketPoints >= 20);

              if (winners.length > 0) {
                console.log(
                  `We have ${winners.length === 1 ? "a winner" : "winners"}!`
                );
              }
            });
          }
        });
      });
    }
  };

  useEffect(() => {
    updateLottery();
    if (lottery.id !== undefined) {
      updateTicketList();
      // console.log(filter);
      // lotteryContract.on(filter, (owner, lotteryId, ticketId) => {
      //   const ev = {
      //     owner,
      //     lottery: lotteryId.toNumber(),
      //     ticket: ticketId.toString(),
      //   };
      //   console.log(ev);
      // });
    }

    return function cleanup() {
      lotteryContract.removeAllListeners();
    };
  }, [account, lottery]);

  return (
    <LotteryContext.Provider
      value={{
        lottery: lottery,
        tickets: tickets,
        onStartNewLottery: startNewLottery,
        onCloseLottery: closeLottery,
        onDrawNumber: drawLotteryNumber,
        onBuyTicket: buyTicket,
      }}
    >
      {children}
    </LotteryContext.Provider>
  );
};

export default LotteryContext;
