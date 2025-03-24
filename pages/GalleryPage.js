import React from "react";
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';
import { MyStyles } from "../styles/MyStyle";

export default function GalleryPage({ navigation }) {
  return (
    <ImageBackground
      source={require("../assets/wallpaper.jpg")} // Replace with your background image path
      style={styles.background}
    >
      <SafeAreaView style={MyStyles.container}>
        <View style={MyStyles.arrowHeader}>
          <TouchableOpacity
            style={MyStyles.arrowIcon}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-outline" size={30} color="white" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerText}>Gallery</Text>
          </View>
          <View style={{ width: 35 }} />
        </View>
        
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  headerText: {
    fontSize: 24,
    fontFamily: "ComfortaaBold",
    color: "white",
    textAlign: "center",
  },
});