import React, { Component, useState } from "react";
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity , TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native";
import { MyStyles } from "../styles/MyStyle";


export default function ImportPet({navigation}) {
  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <SafeAreaView style={styles.topNavBar}>
        <View style={MyStyles.header}>
          <TouchableOpacity
            style={{ marginRight: 12 }}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={45} color="black" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Main Content */}
        <View style={styles.noPetsContainer}>
          <Text style={styles.title}>Add Existing Pet</Text>
          <Text style={styles.subtitle}>
            Here you can import an existing pet using an invitation code provided by the pet owner.
          </Text>
          <Text style={styles.subtitle}>
            The owner can invite you as an additional member
          </Text>
          <Text style={styles.buttonText}>Invite-Code</Text>
          <TextInput
            style={styles.input}
            placeholder="xxxxxx"
          />
          
          <TouchableOpacity
            style={styles.button} 
            onPress={() => navigation.navigate("Home")} 
          >
            <Text style={styles.buttonText}>IMPORT</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EACEBE",

  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  topNavBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: '#B6917B',
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d9c2b0",
    borderRadius: 15,
    padding: 10,
    margin: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  gender: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A4A4A",
  },
  age: {
    fontSize: 14,
    color: "#7B7B7B",
  },
  noPetsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#B6917B',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
});
