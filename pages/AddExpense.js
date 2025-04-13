import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MyStyles } from "../styles/MyStyle";
import { StatusBar } from "expo-status-bar";
import { addExpense } from "../api/expense/postExpense"; // API to add expense
import { getPetsByUserId } from "../api/pet/getPetFromId"; // API to fetch pets
import { showToast } from "../services/showToast";
import petplaceholder from "../assets/petplaceholder.png"; // Placeholder image for pets

export default function AddExpense({ navigation }) {
  const [expense_title, setTitle] = useState("");
  const [expense_detail, setDetail] = useState("");
  const [amount, setAmount] = useState("");
  const [pets, setPets] = useState([]);
  const [selectedPets, setSelectedPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const petData = await getPetsByUserId();
        setPets(petData);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchPets();
  }, []);

  const handleTogglePet = (petId) => {
    if (selectedPets.includes(petId)) {
      setSelectedPets(selectedPets.filter((id) => id !== petId));
    } else {
      setSelectedPets([...selectedPets, petId]);
    }
  };

  const handleAddExpense = async () => {
    if (
      !expense_title.trim() ||
      !expense_detail.trim() ||
      !amount ||
      selectedPets.length === 0
    ) {
      showToast("error", "All fields are required");
      return;
    }
  
    try {
      const dividedAmount = parseFloat(amount) / selectedPets.length;

      for (const petId of selectedPets) {
        const expenseData = {
          expense_title: expense_title.trim(),
          expense_detail: expense_detail.trim(),
          amount: dividedAmount,
          pet_id: petId,
        };

        console.log("Expense data:", expenseData);
        
        await addExpense(expenseData);
      }
  
      showToast("success", "Expense added successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error adding expense:", error);
      showToast("error", "Failed to add expense");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/wallpaper.jpg")}
      style={MyStyles.background}
    >
      <StatusBar backgroundColor="transparent" style="dark" />
      <SafeAreaView style={styles.container}>
        <View style={MyStyles.arrowHeader}>
          <TouchableOpacity
            style={MyStyles.arrowIcon}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-outline" size={30} color="white" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerText}>Add Expense</Text>
          </View>
          <View style={{ width: 35 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter expense title"
            value={expense_title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Detail</Text>
          <View style={styles.inputContainer}>
          <TextInput
            style={styles.contentInput}
            placeholder="Enter Description"
            multiline={true}
            numberOfLines={6}
            value={expense_detail}
            onChangeText={setDetail}
          />
          </View>

          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <Text style={styles.label}>Select your Pet </Text>
          <View style={styles.petContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {pets.length > 0 ? (
                pets.map((pet) => (
                  <TouchableOpacity
                    key={pet.pet_id}
                    style={[
                      styles.petItem,
                      selectedPets.includes(pet.pet_id) &&
                        styles.selectedPetItem,
                    ]}
                    onPress={() => handleTogglePet(pet.pet_id)}
                  >
                    <Image
                      style={styles.petImage}
                      source={
                        pet.profile_path
                          ? { uri: pet.profile_path }
                          : petplaceholder
                      }
                    />
                    <Text style={styles.petName}>{pet.pet_name}</Text>
                    {selectedPets.includes(pet.pet_id) && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="green"
                      />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noPetsText}>No pets available</Text>
              )}
            </ScrollView>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleAddExpense}>
            <Text style={styles.buttonText}>Add Expense</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontFamily: "ComfortaaBold",
    textAlign: "center",
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontFamily: "ComfortaaBold",
    marginBottom: 5,
  },
  contentInput: {
    fontSize: 16,
    fontFamily: "Comfortaa",
    height: 130,
    marginBottom: 5,
    borderRadius: 10,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
  },
  inputContainer: {
    position: 'relative',
    width: "100%",
    backgroundColor: "#FFF",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#B6917B",
    borderRadius: 8,
  },
  input: {
    fontSize: 16,
    fontFamily: "Comfortaa",
    height: 50,
    borderWidth: 1,
    borderColor: "#B6917B",
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
  },
  headerText: {
    fontSize: 26,
    fontFamily: "ComfortaaBold",
    textAlign: "center",
    color: "white",
    includeFontPadding: false,
  },
  petItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    borderColor: "#B6917B",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#FFF",
  },
  selectedPetItem: {
    backgroundColor: "#D3F9D8",
  },
  petImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  petName: {
    fontSize: 16,
    fontFamily: "Comfortaa",
    flex: 1,
  },
  noPetsText: {
    fontSize: 16,
    fontFamily: "ComfortaaBold",
    color: "gray",
    textAlign: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#493628",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "ComfortaaBold",
    color: "#FFF",
  },
  petContainer: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#B6917B",
    borderRadius: 8,
    paddingTop: 10,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
  },
  petItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    borderColor: "#B6917B",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#FFF",
  },
  selectedPetItem: {
    backgroundColor: "#D3F9D8",
  },
  petImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  petName: {
    fontSize: 16,
    fontFamily: "Comfortaa",
    flex: 1,
  },
  noPetsText: {
    fontSize: 16,
    fontFamily: "ComfortaaBold",
    color: "gray",
    textAlign: "center",
    marginTop: 10,
  },
});
