import React, { Component, useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native";
import { MyStyles } from "../styles/MyStyle";
import { getAllPet } from "../composable/getAllPet";
import { showDelToast } from "../composable/showToast.js";

export default function Home({navigation}) {

  const [items, setItems] = useState({});

  useEffect(() => {
    const getPets = async () => {
     try {
       const pets = await getAllPet();
       setItems(pets); 
     } catch (error) {
       console.error('Failed to fetch pets in component:', error);
     }
   };
   getPets();
 }, []);

  // const [data, addPet] = useState([
  //   // { id: 1, name: "Fur", age: "2 Years and 1 Month", gender: "male", image: "https://via.placeholder.com/80" },
  //   // { id: 2, name: "Snow", age: "1 Year and 6 Months", gender: "female", image: "https://via.placeholder.com/80" },

  // ]);

  const renderItem = ({ item }) => (
    <View style={MyStyles.petItem}>
      <Text>{item.name}</Text>
      <Text>{item.age}</Text>
      <Text>{item.gender}</Text>
      <Image source={{ uri: item.image }} style={MyStyles.petImage} />
    </View>
  );
  

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <SafeAreaView style={styles.topNavBar}>
        <View style={MyStyles.header}>
        <TouchableOpacity
          style={{marginRight: 12}}
          onPress={() => addPet(true)}
        >
          <Ionicons name="add-circle-outline" size={45} color="black" />
        </TouchableOpacity>
      </View>
      </SafeAreaView>

      {/* Main Content */}
      {items.length > 0 ? (
        <FlatList
        items={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      ) : (
        <View style={styles.noPetsContainer}>
          <Text style={styles.title}>NO PETS</Text>
          <Text style={styles.subtitle}>
            ADD A PET FOR THE FIRST TIME BY CLICKING ON THE BUTTON BELOW OR THE + BUTTON.
          </Text>
          <TouchableOpacity
            style={styles.button} 
            onPress={() => navigation.navigate("NewPet")} 
          >
            <Text style={styles.buttonText}>ADD YOUR PET</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EACEBE",

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
