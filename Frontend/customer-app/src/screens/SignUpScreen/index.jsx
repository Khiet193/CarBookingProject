import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";

import styles from "./styles";
import { LOAI_TAI_KHOAN, TK_INFO } from "../../constants";
import { dangKy } from "../../api/user";
import { save } from "../../utils/storage";

const SignUpScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("0787875681");
  const [password, setPassword] = useState("Hello@123");
  const [fullName, setFullName] = useState("Khách Hàng 01");
  const [confirmPassword, setConfirmPassword] = useState("Hello@123");

  const handleLogin = async () => {
    // Perform login logic here
    try {
      const signupData = {
        soDienThoai: phoneNumber,
        password: password,
        loaiTaiKhoan: LOAI_TAI_KHOAN.KHACH_HANG,
        hoTen: fullName,
        bienSoXe: "",
      };

      await dangKy(signupData);
      navigation.navigate("SignInScreen");
    } catch (error) {
      console.error("SignUpScreen", error);
    } finally {
    }
  };

  const _handleCloseError = () => {
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Nhập lại Mật khẩu"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Họ Tên"
        value={fullName}
        onChangeText={(text) => setFullName(text)}
      />
      <Button title="SignUp" onPress={handleLogin} />
    </View>
  );
};

export default SignUpScreen;
