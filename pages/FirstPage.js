import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function FirstPage({ navigation }) {
  return (
    <View style={styles.container}>
      {/* <Image source={require("./paw-logo.png")} style={styles.logo} /> */}
      <Text style={styles.title}>Paw Care</Text>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>LOG IN</Text>
      </TouchableOpacity>

      <TouchableOpacity
      onPress={() => navigation.navigate('NewAccount')}
      >
        <Text style={styles.linkText}>CREATE ACCOUNT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EACEBE",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4A4A4A",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#B6917B",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  linkText: {
    fontSize: 14,
    color: "#4A4A4A",
  },
});