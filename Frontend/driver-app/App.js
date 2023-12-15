import React, { useContext, useEffect } from "react";

import HomeScreen from "./src/screens/HomeScreen";
import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import AuthLoadingScreen from "./src/screens/AuthLoadingScreen";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AppProvider, AppContext } from "./src/context/AppContext";

const Stack = createStackNavigator();

const App = () => {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
};

const AppNavigator = () => {
  const { currentUser } = useContext(AppContext);
  useEffect(() => {
    console.log("AppNavigator", currentUser);
  }, [currentUser]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Loading"
          component={AuthLoadingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          options={{
            headerShown: false,
          }}
          component={HomeScreen}
        />
        <Stack.Screen
          options={{
            headerLeft: null,
            headerShown: false,
          }}
          name="SignInScreen"
          component={SignInScreen}
        />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
