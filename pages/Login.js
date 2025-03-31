import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { postLoginUser } from "../api/user/postLoginUser";
import { MyStyles } from "../styles/MyStyle";
import { showLoginToast } from '../services/showToast';
import { StatusBar } from "expo-status-bar";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      showLoginToast('error require');
      return;
    }

    const userData = {
      username,
      password,
    };

    try {
      const response = await postLoginUser(userData);
      navigation.navigate('Main');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        showLoginToast('error');
      } else {
        showLoginToast('error 401');
      }
    } finally {
      setUsername("");
      setPassword(""); // Clear the password field
    }
  };

  return (
    <ImageBackground
      source={require('../assets/wallpaper.jpg')}
      style={MyStyles.background}
    >
      <View style={styles.container}>
         <StatusBar backgroundColor="transparent" style="dark" />
        <Text style={styles.title}>Login</Text>

        <Text style={styles.label}>Username</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#555"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="********"
            placeholderTextColor="#555"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#555"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('NewAccount')}
        >
          <Text style={styles.linkText}>OR HAVE NO ACCOUNT ?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginText}>LOG IN</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontFamily: "ComfortaaBold",
    color: "#493628",
    marginBottom: 10,
    textShadowColor: "#ab886d",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontFamily: "ComfortaaBold",
    color: "#493628",
    marginBottom: 1,
    marginLeft: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Comfortaa",
    color: "#493628",
    paddingVertical: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  eyeIcon: {
    padding: 8,
  },
  loginButton: {
    backgroundColor: "#493628",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  loginText: {
    fontSize: 16,
    fontFamily: "ComfortaaBold",
    color: "#fff",
  },
  linkText: {
    fontSize: 14,
    fontFamily: "ComfortaaBold",
    color: "black",
    marginBottom: 5,
    opacity: 0.7,
    textShadowColor: "#ab886d",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});