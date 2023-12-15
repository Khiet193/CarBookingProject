import React, {
  useState,
  useMemo,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { getValueFor } from "../utils/storage";
import { TK_INFO } from "../constants";

export const AppContext = React.createContext();

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

  const loadLocalUserInfo = async () => {
    let userInfo = await getValueFor(TK_INFO);
    console.log("loadLocalUserInfo", userInfo);
    if (userInfo) userInfo = await JSON.parse(userInfo);
    setCurrentUser(userInfo);
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
