import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";

import styles from "./styles";
import { LOAI_TAI_KHOAN } from "../../constants";
import { dangKy } from "../../api/user";

const SignUpScreen = ({ navigation }) => {
  const [bikeNumber, setBikeNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = async () => {
    // Perform login logic here
    try {
      const signupData = {
        soDienThoai: phoneNumber,
        password: password,
        hoTen: fullName,
        bienSoXe: bikeNumber,
        loaiTaiKhoan: LOAI_TAI_KHOAN.TAI_XE,
      };

      await dangKy(signupData);
      navigation.navigate("SignInScreen");
    } catch (error) {
      console.log("Signup", error);
    }
  };

  const _handleCloseError = () => {
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputForm}>
        <View style={styles.field}>
          <Text>Họ Tên</Text>
          <TextInput
            style={styles.input}
            placeholder="Họ Tên"
            value={fullName}
            onChangeText={(text) => setFullName(text)}
          />
        </View>
        <View style={styles.field}>
          <Text>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
          />
        </View>
        <View style={styles.field}>
          <Text>Nhâp Mật khẩu</Text>
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <View style={styles.field}>
          <Text>Nhập lại mật khẩu</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Nhập lại Mật khẩu"
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
        </View>
        <View style={styles.field}>
          <Text>Biển số xe</Text>
          <TextInput
            style={styles.input}
            placeholder="Biển số xe"
            value={bikeNumber}
            onChangeText={(text) => setBikeNumber(text)}
          />
        </View>
      </View>

      <Button style={styles.button} title="SignUp" onPress={handleLogin} />
    </View>
  );
};

export default SignUpScreen;
