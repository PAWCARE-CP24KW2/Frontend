import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, } from "react-native";
import { MyStyles } from "../styles/MyStyle";
import { StatusBar } from "expo-status-bar";

export default function FirstPage({ navigation }) {
  return (
    <ImageBackground
      source={require('../assets/wallpaper.jpg')}
      style={MyStyles.background}
    >
      <StatusBar backgroundColor="transparent" style="dark" />
      <View style={styles.container}>
        <Image source={require('../assets/Logo_PawCare.png')} style={styles.logo} />
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
  logo: {
    width: 250,
    height: 250,
    marginBottom: 0,
  },
  title: {
    fontSize: 46,
    fontFamily: "ComfortaaBold",
    color: "#493628",
    marginBottom: 20,
    textShadowColor: "#ab886d",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  button: {
    backgroundColor: "#493628",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "ComfortaaBold",
    color: "#fff",
  },
  linkText: {
    fontSize: 14,
    fontFamily: "ComfortaaBold",
    color: "black",
    opacity: 0.7,
    textShadowColor: "#ab886d",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});