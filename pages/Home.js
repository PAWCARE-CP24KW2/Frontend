import React, { useState, useEffect , useCallback} from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MyStyles } from "../styles/MyStyle";
import { getAllPet } from "../composable/getAllPet";
import { useFocusEffect } from "@react-navigation/native";

export default function Home({ navigation }) {
  const [items, setItems] = useState([]);

    const getPets = async () => {
      try {
        const pets = await getAllPet();
        console.log("Response data:", pets);
        setItems(pets);
      } catch (error) {
        console.error("Failed to fetch pets in component:", error);
      }
    };

    useFocusEffect(
      useCallback(() => {
        getPets();
      }, [])
    );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("ViewPet", { pet: item }) }
    >
      <View style={MyStyles.petItem}>
        <Image
          style={styles.image}
          source={{ uri: "https://via.placeholder.com/80" }} // คุณสามารถเพิ่ม URL รูปภาพจริงแทน placeholder ได้
        />
        <View style={styles.infoContainer}>
          <Text style={styles.gender}>{item.pet_name}</Text>
          <Text style={styles.age}>Breed: {item.pet_breed}</Text>
          <Text style={styles.age}>Type: {item.pet_type}</Text>
          <Text style={styles.age}>Weight: {item.weight} kg</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <SafeAreaView style={styles.topNavBar}>
        <View style={MyStyles.header}>
          <TouchableOpacity
            style={{ marginRight: 12 }}
            onPress={() => navigation.navigate("NewPet")}
          >
            <Ionicons name="add-circle-outline" size={45} color="black" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Main Content */}
      {items.length > 0 ? (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) =>
            item.id ? item.id.toString() : Math.random().toString()
          }
        />
      ) : (
        <View style={styles.noPetsContainer}>
          <Text style={styles.title}>NO PETS</Text>
          <Text style={styles.subtitle}>
            ADD A PET FOR THE FIRST TIME BY CLICKING ON THE BUTTON BELOW OR THE
            + BUTTON.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("AddPet")}
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
    backgroundColor: "#B6917B",
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
  cardtitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#B6917B",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
});
