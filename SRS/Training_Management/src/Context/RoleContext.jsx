// src/context/AuthContext.js
import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { name, email, dob, role }

  const login = ({ name, email, dob, role }) => {
    setUser({ name, email, dob, role });
  };

  const logout = () => {
    setUser(null);
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
