const appReducer = (state, action) => {
  switch (action.type) {
    case "SET_WEB3_PROVIDER":
      return {
        ...state,
        web3: {
          ...state.web3,
          provider: action.payload,
        },
      };
    case "SET_WEB3_CONTRACTS":
      return {
        ...state,
        web3: {
          ...state.web3,
          contract: action.payload,
        },
      };
    case "SET_ACCOUNT_ADDRESS":
      return {
        ...state,
        account: {
          ...state.account,
          address: action.payload,
        },
      };
    case "SET_ACCOUNT_BALANCE":
      return {
        ...state,
        account: {
          ...state.account,
          balance: action.payload,
        },
      };
    case "SET_LOTTERY":
      return {
        ...state,
        lottery: action.payload,
      };
    case "SET_LOTTERY_TICKETS":
      return {
        ...state,
        lottery: {
          ...state.lottery,
          tickets: action.payload,
        },
      };
    default:
      return state;
  }
};

export default appReducer;
