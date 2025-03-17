import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { postUser } from "../api/user/postUser";
import { MyStyles } from "../styles/MyStyle";

export default function CreateAccountScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleContinue = async () => {
    if (!firstname || !lastname || !username || !password || !confirmPassword || !email || !phone) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    const userData = {
      username,
      password,
      email,
      user_firstname: firstname,
      user_lastname: lastname,
      user_phone: phone,
    };

    try {
      await postUser(userData);
      Alert.alert("Success", "Account created successfully", [
        { text: "OK", onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to create account");
    }
  };

  return (
    <ImageBackground
      source={require('../assets/wallpaper.jpg')}
      style={MyStyles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>

        <Text style={styles.label}>First Name</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#555"
            value={firstname}
            onChangeText={setFirstname}
          />
        </View>

        <Text style={styles.label}>Last Name</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#555"
            value={lastname}
            onChangeText={setLastname}
          />
        </View>

        <Text style={styles.label}>Username</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#555"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
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

        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="********"
            placeholderTextColor="#555"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Email</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="jane@example.com"
            placeholderTextColor="#555"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <Text style={styles.label}>Phone</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="xxxxxxxxxx"
            placeholderTextColor="#555"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TouchableOpacity 
          style={styles.RegisButton}
          onPress={handleContinue}
        >
          <Text style={styles.register}>CONTINUE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.linkText}>OR HAVE ACCOUNT ?</Text>
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
    fontSize: 32,
    fontWeight: "bold",
    color: "#493628",
    marginBottom: 10,
    textShadowColor: "#ab886d",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    color: "#493628",
    fontWeight: "bold",
    marginLeft: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingVertical: 12,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  inputPassword: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingVertical: 12,
  },
  eyeIcon: {
    padding: 10,
  },
  RegisButton: {
    backgroundColor: "#493628",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  register: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  linkText: {
    fontSize: 14,
    color: "#000",
    marginTop: 10,
  },
});