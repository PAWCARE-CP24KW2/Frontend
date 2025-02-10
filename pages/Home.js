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
import { getPetsByUserId } from '../composable/getPetFromId';
import { useFocusEffect } from "@react-navigation/native";
import petplaceholder from '../assets/petplaceholder.png';


export default function Home({ navigation }) {
  const [items, setItems] = useState([]);
  const [image, setImage] = useState();

    const getPets = async () => {
      // console.log("item", items);
      try {
        const pets = await getPetsByUserId();
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

    const calculateAge = (birthdate) => {
      const birthDate = new Date(birthdate);
      const today = new Date();
  
      let years = today.getFullYear() - birthDate.getFullYear();
      let months = today.getMonth() - birthDate.getMonth();
      let days = today.getDate() - birthDate.getDate();
  
      if (days < 0) {
        months--;
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      }
  
      if (months < 0) {
        years--;
        months += 12;
      }
  
      return `${years} year${years > 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''} ${days} day${days !== 1 ? 's' : ''}`;
    };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("ViewPet", { pet: item },  ) }
    >
      <View style={styles.petCard}>
        <Image style={[styles.petImage, image && styles.imageWithBorder]}
               source={image ? { uri: image } : petplaceholder}
        />
        <Text style={styles.petName}>{item.pet_name}</Text>
        <Text style={styles.petAge}>{calculateAge(item.date_of_birth)} old</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <SafeAreaView  style={[styles.topNavBar, { backgroundColor: "#B6917B" }]}>
        <View style={MyStyles.header}>
          <TouchableOpacity
            style={{ marginRight: 12 }}
            onPress={() => navigation.navigate("AddPet")}
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
    color: "black",
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
  petCard: {
    backgroundColor: "#B6917B",
    borderRadius: 15,
    margin: 15,
    padding: 15,
    alignItems: "center",
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  petName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    color: "black",
  },
  petAge: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
  },
});
