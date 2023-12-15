import React, { useEffect, useState, useContext } from "react";
import { View, Text, Button, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getValueFor, save } from "../../utils/storage";
import { ACCESS_TOKEN, TK_INFO } from "../../constants";
import { AppContext } from "../../context/AppContext";

const Sidebar = ({ navigation }) => {
  const { currentUser, setUser } = useContext(AppContext);

  const handleLogout = async () => {
    // Perform logout logic here
    await save(TK_INFO, "");
    await save(ACCESS_TOKEN, "");

    setUser(null);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: "column" }}>
        <View style={{ flex: 1, padding: 20, alignItems: "center" }}>
          <View
            style={{
              width: 100,
              height: 100,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
              borderWidth: 1,
              borderRadius: 80,
              marginBottom: 32,
            }}
          >
            <Image
              source={require("../../../assets/icons/customer.png")}
              style={{ height: 60, width: 60 }}
            />
          </View>
          {currentUser && (
            <View style={{ alignItems: "flex-start", width: "100%" }}>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                Họ Tên: {currentUser.hoTen}
              </Text>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                Số điện thoại: {currentUser.soDienThoai}
              </Text>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                Biển số xe: {currentUser.bienSoXe}
              </Text>
            </View>
          )}
        </View>

        <View>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Sidebar;
