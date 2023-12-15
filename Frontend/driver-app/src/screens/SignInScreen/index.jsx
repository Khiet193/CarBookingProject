import React, { useContext, useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { ACCESS_TOKEN, LOAI_TAI_KHOAN, TK_INFO } from "../../constants";
import { getValueFor, save } from "../../utils/storage";
import { dangNhap } from "../../api/user";
import { AppContext } from "../../context/AppContext";

const SignInScreen = ({ navigation }) => {
  const { currentUser, setUser } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorForm, setErrorForm] = useState(null);
  useEffect(() => {
    console.log("SignInScreen", currentUser);
  }, [currentUser]);

  // Function to handle form submission
  const handleLogin = async () => {
    try {
      setErrorForm(null);
      const loginData = {
        soDienThoai: phone,
        password: password,
      };
      setLoading(true);
      let response = await dangNhap(loginData);
      const infoAccount = response.thongTinTaiKhoan;
      if (infoAccount.loaiTaiKhoan === LOAI_TAI_KHOAN.KHACH_HANG) {
        setErrorForm("Invalid Account Type");
        throw Error("Invalid Account Type");
      } else {
        await setUser(infoAccount);
        await save(TK_INFO, JSON.stringify(infoAccount));
        await save(ACCESS_TOKEN, response.accessToken);

        const data = await getValueFor(TK_INFO);
        console.log(data, currentUser);
        // navigation.navigate("HomeScreen");
      }
    } catch (error) {
      setErrorForm(JSON.stringify(error));

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const _handleSignUp = () => {
    navigation.navigate("SignUpScreen");
  };

  return (
    <View
      style={[
        styles.container,
        errorForm && { borderRadius: 2, border: "1px solid red" },
      ]}
    >
      {errorForm && (
        <View
          style={{
            marginBottom: 24,
            backgroundColor: "#f3baba",
            padding: 12,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "red" }}>{errorForm}</Text>
        </View>
      )}
      <Text
        style={{
          color: "green",
          fontSize: 32,
          fontWeight: "bold",
          marginBottom: 32,
        }}
      >
        {"App Tài Xế"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        onChangeText={(text) => setPhone(text)}
        value={phone}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <TouchableOpacity
        disabled={loading}
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>{loading ? "Loading" : "Login"}</Text>
      </TouchableOpacity>
      <View style={styles.signUpButton}>
        <Text>Dont't have account yet?</Text>
        <TouchableOpacity onPress={_handleSignUp}>
          <Text style={styles.buttonRegister}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    width: "100%",
    height: 40,
    backgroundColor: "#4267B2",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  signUpButton: {
    marginTop: 32,
    width: "100%",
    height: 40,
    flexDirection: "row",
  },
  buttonRegister: {
    color: "#4267B2",
  },
});

export default SignInScreen;
