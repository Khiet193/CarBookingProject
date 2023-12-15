import React, { useContext } from "react";
import { View } from "react-native";
import Map from "../../components/Map";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Sidebar from "../SideBar";
import { AppContext } from "../../context/AppContext";

const Drawer = createDrawerNavigator();

const HomeScreen = () => {
  const { currentUser } = useContext(AppContext);
  console.log("HomeScreen", currentUser);
  return (
    <View style={{ flex: 1 }}>
      <Drawer.Navigator drawerContent={(props) => <Sidebar {...props} />}>
        <Drawer.Screen name="Home" component={Map} />
      </Drawer.Navigator>
    </View>
  );
};

export default HomeScreen;
