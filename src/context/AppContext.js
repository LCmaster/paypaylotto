import { createContext, useEffect, useReducer } from "react";
import appReducer from "./AppReducer";

import TokenContract from "../artifacts/contracts/PayPayToken.sol/PayPayToken.json";
import TicketContract from "../artifacts/contracts/PayPayTicket.sol/PayPayTicket.json";
import LotteryContract from "../artifacts/contracts/PayPayLottery.sol/PayPayLottery.json";

import contracts from "../contracts.json";
import { ethers } from "ethers";

function isLotteryEqual(lotto1, lotto2) {
  if (
    lotto1.id === undefined ||
    lotto2.id === undefined ||
    lotto1.status === undefined ||
    lotto2.status === undefined ||
    lotto1.ticketPrice === undefined ||
    lotto2.ticketPrice === undefined ||
    lotto1.startingAt === undefined ||
    lotto2.startingAt === undefined ||
    lotto1.closingAt === undefined ||
    lotto2.closingAt === undefined ||
    lotto1.winningNumbers === undefined ||
    lotto2.winningNumbers === undefined
  )
    return false;

  return (
    lotto1.id === lotto2.id &&
    lotto1.status === lotto2.status &&
    lotto1.ticketPrice === lotto2.ticketPrice &&
    lotto1.startingAt === lotto2.startingAt &&
    lotto1.closingAt === lotto2.closingAt &&
    lotto1.winningNumbers.length === lotto2.winningNumbers.length &&
    lotto1.winningNumbers.every(
      (val, index) => val === lotto2.winningNumbers[index]
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

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, {});

  const updateBalance = () => {
    state.web3.contract.token
      .balanceOf(state.account.address)
      .then((accountBalance) => {
        const actualBalance = ethers.utils.formatUnits(accountBalance, "wei");

        console.log("Account Balance: " + actualBalance);
        if (
          state.account.balance === undefined ||
          state.account.balance !== actualBalance
        ) {
          dispatch({
            type: "SET_ACCOUNT_BALANCE",
            payload: actualBalance,
          });
        }
      });
  };

  const buyTokenHandler = async (input) => {
    const options = {
      to: state.web3.contract.token.address,
      value: ethers.utils.parseUnits(input, "finney"),
    };

    const signer = state.web3.provider.getSigner();

    signer.sendTransaction(options).then((tx) => {
      tx.wait().then((receipt) => {
        updateBalance();
      });
    });
  };

  const updateLottery = () => {
    if (state?.web3?.contract?.lottery) {
      state.web3.contract.lottery.getCurrentLottery().then((remote) => {
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

        // if (!isLotteryEqual(state.lottery, current))
        dispatch({
          type: "SET_LOTTERY",
          payload: current,
        });
      });
    }
  };

  const startNewLotteryHandler = async () => {
    const tx = await state.web3.contract.lottery.startLottery();
    await tx.wait();
    updateLottery();
  };

  const updateTicketList = () => {
    if (state.lottery && state.lottery.id > 0) {
      state.web3.contract.ticket
        .tickets(state.account.address, state.lottery.id)
        .then((ticketsIds) => {
          dispatch({
            type: "SET_LOTTERY_TICKETS",
            payload: ticketsIds
              .map((entry) => entry.toString())
              .map((entry) => {
                return { id: entry, numbers: getNumbersFromId(entry) };
              }),
          });
        });
    }
  };

  const buyTicketHandler = async (amount) => {
    const approveTx = await state.web3.contract.token.approve(
      state.web3.contract.lottery.address,
      state.lottery.ticketPrice
    );
    await approveTx.wait();

    const ticketId = generateTicketId(state.lottery.id);
    const buytTicketTx = await state.web3.contract.lottery.buyTicket(
      state.web3.contract.token.address,
      state.web3.contract.ticket.address,
      ticketId
    );
    await buytTicketTx.wait();
    updateTicketList();
    updateBalance();
  };

  const closeLotteryHandler = async () => {
    await state.web3.contract.lottery.closeLottery().then((tx) => {
      tx.wait().then(() => {
        updateLottery();
      });
    });
  };

  const drawLotteryNumberHandler = () => {
    if (state.lottery && Array.isArray(state.lottery.winningNumbers)) {
      let pickedNumbers = [];
      for (let i = 0; i < state.lottery.winningNumbers.length; i++) {
        if (state.lottery.winningNumbers[i]) {
          pickedNumbers.push(i + 1);
        }
      }

      let randomNumber;
      while (true) {
        randomNumber = randomInt();
        if (!pickedNumbers.includes(randomNumber)) break;
      }

      state.web3.contract.lottery.drawNumber(randomNumber).then((tx) => {
        tx.wait().then(() => {
          // console.log("Number drawn: " + randomNumber);
          updateLottery();
          pickedNumbers.push(randomNumber);
          pickedNumbers = pickedNumbers.sort((a, b) => a - b);

          if (pickedNumbers.length >= 20) {
            const filter = state.web3.contract.lottery.filters.TicketBought(
              state.lottery.id
            );
            state.web3.contract.lottery
              .queryFilter(filter)
              .then((eventArray) => {
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

  const init = () => {
    // If no web3 provider
    if (state.web3 === undefined) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      dispatch({
        type: "SET_WEB3_PROVIDER",
        payload: provider,
      });
    } else {
      if (state.account === undefined) {
        const provider = state.web3.provider;
        provider.send("eth_requestAccounts", []).then(() => {
          const signer = provider.getSigner();
          signer.getAddress().then((currentAccount) => {
            dispatch({
              type: "SET_ACCOUNT_ADDRESS",
              payload: currentAccount,
            });
          });
        });
      } else {
        if (state.web3.contract === undefined) {
          const provider = state.web3.provider;
          const signer = provider.getSigner();

          const token = new ethers.Contract(
            contracts.token,
            TokenContract.abi,
            signer
          );
          const ticket = new ethers.Contract(
            contracts.ticket,
            TicketContract.abi,
            signer
          );
          const lottery = new ethers.Contract(
            contracts.lottery,
            LotteryContract.abi,
            signer
          );

          dispatch({
            type: "SET_WEB3_CONTRACTS",
            payload: {
              token: token,
              ticket: ticket,
              lottery: lottery,
            },
          });
        } else {
          if (state.account.balance) {
            if (state.lottery) {
              if (state.lottery.id > 0 && state.lottery.tickets == undefined) {
                updateTicketList();
              }
            } else {
              state.web3.contract.lottery
                .currentLotteryId()
                .then((currentLotteryId) => {
                  const lotteryId = currentLotteryId.toNumber();
                  console.log("Current Lottery ID: " + lotteryId);
                  if (lotteryId === 0) {
                    dispatch({
                      type: "SET_LOTTERY",
                      payload: {
                        id: 0,
                        status: 0,
                        ticketPrice: 0,
                        startingAt: 0,
                        closingAt: 0,
                        winningNumbers: [],
                      },
                    });
                  } else {
                    updateLottery();
                  }
                });
            }
          } else {
            updateBalance();
          }
        }
      }
    }
  };

  useEffect(() => {
    init();

    return function cleanup() {
      if (
        state &&
        state.web3 &&
        state.web3.contract &&
        state.web3.contract.lottery
      ) {
        state.web3.contract.lottery.removeAllListeners();
      }
    };
  }, [state]);

  return (
    <>
      {state.account ? (
        <AppContext.Provider
          value={{
            state,
            dispatch,
            onBuyToken: buyTokenHandler,
            onBuyTicket: buyTicketHandler,
            onStartNewLottery: startNewLotteryHandler,
            onCloseLottery: closeLotteryHandler,
            onDrawNumber: drawLotteryNumberHandler,
          }}
        >
          {children}
        </AppContext.Provider>
      ) : (
        <div className="auth-guard">You need MetaMask to run this app.</div>
      )}
    </>
  );
};

export default AppContext;
