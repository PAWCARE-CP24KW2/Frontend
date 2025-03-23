import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  RefreshControl,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MyStyles } from "../styles/MyStyle";
import { getPetsByUserId } from "../api";
import { useFocusEffect } from "@react-navigation/native";
import petplaceholder from "../assets/petplaceholder.png";
import LoadingScreen from "../components/common/LoadingScreen";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from "expo-image";
import vet from '../assets/vet.png';

export default function Home({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getPets = async () => {
    try {
      const pets = await getPetsByUserId();
      setItems(pets);
    } catch (error) {
      console.error("Failed to fetch pets in component:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getPets();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await getPets();
    setRefreshing(false);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

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

    return `${years} year${years > 1 ? "s" : ""} ${months} month${
      months !== 1 ? "s" : ""
    } ${days} day${days !== 1 ? "s" : ""}`;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("ViewPet", { pet: item })}
    >
      <View style={styles.petCard}>
        <View style={styles.colorBar} />
        <Image
          style={[
            styles.petImage,
            item?.profile_path && styles.imageWithBorder,
          ]}
          source={item?.profile_path || petplaceholder}
          contentFit="cover"
          transition={500}
        />
        <View style={styles.petNameContainer}>
          <Text style={styles.petName}>
            {capitalizeFirstLetter(item.pet_name)}
          </Text>
          {item.pet_gender === "male" ? (
            <Ionicons name="male" size={28} color="black" style={styles.genderIcon} />
          ) : (
            <Ionicons name="female" size={28} color="black" style={styles.genderIcon} />
          )}
        </View>
        <Text style={styles.petAge}>
          {calculateAge(item.date_of_birth)} old
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={MyStyles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>My Pets</Text>
        </View>
        <LoadingScreen />
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground
      source={require('../assets/wallpaper.jpg')}
      style={MyStyles.background}
    >
      <SafeAreaView style={MyStyles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>My Pets</Text>
        </View>
        
        {items.length > 0 ? (
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) =>
              item.id ? item.id.toString() : Math.random().toString()
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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

        <TouchableOpacity
          style={styles.createPetButton}
          onPress={() => navigation.navigate("AddPet")}
        >
          <Image source={vet} style={styles.addIcon} />
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: "#EACEBE",
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    height: 65,
    backgroundColor: "#493628",
  },
  headerText: {
    fontSize: 30,
    fontFamily: "ComfortaaBold",
    textAlign: "center",
    color: "white",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 100,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  noPetsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "ComfortaaBold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "ComfortaaBold",
    color: "#555",
    textAlign: "center",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#493628",
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "ComfortaaBold",
    color: "#FFF",
  },
  petCard: {
    backgroundColor: "#f1e8e1",
    borderRadius: 15,
    marginHorizontal: 20,
    marginVertical: 8,
    marginTop: 10,
    padding: 15,
    alignItems: "center",
    position: "relative",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  colorBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#8c684f",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  petImage: {
    width: 90,
    height: 90,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  petNameContainer: {
    position: "relative",
    alignItems: "center",
  },
  petName: {
    fontSize: 26,
    fontFamily: "ComfortaaBold",
    color: "black",
  },
  genderIcon: {
    position: "absolute",
    top: -5,
    right: -25,
  },
  petAge: {
    fontSize: 14,
    fontFamily: "ComfortaaBold",
    color: "black",
    opacity: 0.7,
  },
  imageWithBorder: {
    borderWidth: 1.5,
    borderColor: "black",
  },
  createPetButton: {
    position: 'absolute',
    backgroundColor: "#71543F",
    borderRadius: 100,
    padding: 10,
    bottom: 10,
    right: 10,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addIcon: {
    width: 40,
    height: 40,
  },
});