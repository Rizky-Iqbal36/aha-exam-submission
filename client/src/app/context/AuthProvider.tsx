import React, { useContext, createContext, ReactNode, useState } from "react";
import { Cookies } from "react-cookie";

let defaultValue = {
  token: "",
};
const AuthContext = createContext(defaultValue);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const cookies = new Cookies();
  const [token] = useState(cookies.get("accessToken") || "");
  defaultValue.token = token;

  return (
    <AuthContext.Provider value={defaultValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
