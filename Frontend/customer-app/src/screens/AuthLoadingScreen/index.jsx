import { Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { TK_INFO } from "../../constants";
import { getValueFor } from "../../utils/storage";
import { AppContext } from "../../context/AppContext";

const AuthLoadingScreen = ({ navigation }) => {
  const { currentUser, setUser } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoggedInStatus();
  }, [currentUser]);

  const checkLoggedInStatus = async () => {
    try {
      // Check if user data exists in local storage
      if (currentUser) {
        navigation.navigate("HomeScreen");
      } else {
        navigation.navigate("SignInScreen");
      }
    } catch (error) {
      console.log("checkLoggedInStatus", error);
    }

    setIsLoading(false);
  };

  return (
    <View>
      <Text>Loading</Text>
    </View>
  ); // or render a loading spinner if desired
};

export default AuthLoadingScreen;
