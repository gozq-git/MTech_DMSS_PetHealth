import { createContext, useState, ReactNode, useEffect } from "react";

export type AccountType = "user" | "vet";

interface AccountTypeContextProps {
  accountType: AccountType;
  setAccountType: (type: AccountType) => void;
}

export const AccountTypeContext = createContext<AccountTypeContextProps>({
  accountType: "user",
  setAccountType: () => {},
});

export const AccountTypeProvider = ({ children }: { children: ReactNode }) => {
  const [accountType, setAccountType] = useState<AccountType>(() => {
    return (localStorage.getItem("accountType") as AccountType) || "user";
  });

  useEffect(() => {
    localStorage.setItem("accountType", accountType);
  }, [accountType]);

  return (
    <AccountTypeContext.Provider value={{ accountType, setAccountType }}>
      {children}
    </AccountTypeContext.Provider>
  );
};
