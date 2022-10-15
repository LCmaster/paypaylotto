import { createContext, useState } from "react";

const AccountContext = createContext();

export const AccountProvider = ({ children, account }) => {
  return (
    <AccountContext.Provider value={account}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountContext;
