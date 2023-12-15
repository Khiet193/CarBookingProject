import React, {
  useState,
  useMemo,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { getValueFor } from "../utils/storage";
import {
  ACCESS_TOKEN,
  TK_INFO,
  INTERVAL_EXPIRED_TOKEN_TIME_CHECK,
} from "../constants";

export const AppContext = React.createContext();

let intervalTokenExpired;

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const setUser = useCallback((user) => {
    console.log("AppProvider", user);
    if (user) {
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      currentUser,
      setUser,
    }),
    [currentUser, setUser]
  );

  useEffect(() => {
    loadLocalUserInfo();
  }, []);

  useEffect(() => {
    if (intervalTokenExpired) clearInterval(intervalTokenExpired);
    intervalTokenExpired = setInterval(async () => {
      try {
        const token = await getValueFor(ACCESS_TOKEN);
        if (!token) {
          setUser(null);
        }
      } catch (error) {
        console.error("intervalTokenExpired", error);
      }
    }, INTERVAL_EXPIRED_TOKEN_TIME_CHECK);
  }, []);

  const loadLocalUserInfo = async () => {
    try {
      let userInfo = await getValueFor(TK_INFO);
      console.log("loadLocalUserInfo", userInfo);
      if (userInfo) userInfo = await JSON.parse(userInfo);
      setCurrentUser(userInfo);
    } catch (error) {
      console.log("loadLocalUserInfo", error);
    }
  };
  console.log(contextValue);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppState = () => {
  const { currentUser, setUser } = useContext(AppContext);
  const [user, setAppUser] = useState({});
  useEffect(() => {
    setAppUser(user);
  }, [currentUser]);
  return [user, setUser];
};
