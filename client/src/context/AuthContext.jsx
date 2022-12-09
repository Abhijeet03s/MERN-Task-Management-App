import React, { useState, useEffect } from "react";
import { createContext } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

const AuthContext = createContext();

function AuthContextProvider({ children }) {
  const [loggedInUser, setLoggedInUser] = useState({});

  const handleLogOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const logOut = onAuthStateChanged(auth, (loggedInUser) => {
      setLoggedInUser(loggedInUser);
    });
    return () => {
      logOut();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ loggedInUser, handleLogOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthContextProvider };
