import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ImageBackground
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/Ionicons";
import { editPet } from "../api/pet/putPetData";
import DropdownTypeComponent from "../components/dropdowns/DropdownTypePet.js";
import { MyStyles } from "../styles/MyStyle";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UpdatePetData({ route, navigation }) {
  const { pet } = route.params;
  const [petName, setPetName] = useState(pet.pet_name);
  const [petBreed, setPetBreed] = useState(pet.pet_breed);
  const [petType, setPetType] = useState(pet.pet_type);
  const [petColor, setPetColor] = useState(pet.pet_color);
  const [weight, setWeight] = useState(pet.weight.toString());
  const [gender, setGender] = useState(pet.pet_gender);
  const [environment, setEnvironment] = useState(pet.pet_space);
  const [neutered, setNeutered] = useState(pet.pet_neutered);
  const [image, setImage] = useState(pet.image);
  const [selectedDate, setSelectedDate] = useState(
    pet.date_of_birth.split("T")[0]
  );
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(pet.date_of_birth));
  const [mode, setMode] = useState("date");

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const onChange = (event, selectedValue) => {
    if (event.type === "set") {
      if (mode === "date") {
        const currentDate = selectedValue || new Date(pet.date_of_birth);
        setDate(currentDate);
        const formattedDate = new Date(
          currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split("T")[0];
        setSelectedDate(formattedDate);
      }
    }
    setShow(false);
  };

  const handleSave = async () => {
    try {
      if (!pet.pet_id) {
        throw new Error("Pet ID is undefined");
      } else if (!petName) {
        Alert.alert("Error", "Pet Name Cannot be Empty");
        return;
      } else if (!weight) {
        Alert.alert("Error", "Weight Cannot be Empty");
        return;
      }
      const updatedPetData = {
        pet_name: petName,
        pet_breed: petBreed,
        pet_type: petType,
        pet_color: petColor,
        pet_gender: gender,
        pet_space: environment,
        pet_neutered: neutered,
        weight: parseFloat(weight),
        date_of_birth: selectedDate,
        image,
      };
      await editPet(pet.pet_id, updatedPetData);
      Alert.alert("Success", "Pet updated successfully", [
        { text: "OK", onPress: () => navigation.navigate("HomeScreen") },
      ]);
    } catch (error) {
      console.error("Error updating pet:", error);
      Alert.alert("Error", "Failed to update pet");
    }
  };

  const handleWeightChange = (text) => {
    if (/^\d*\.?\d*$/.test(text)) {
      setWeight(text);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/wallpaper.jpg')}
      style={MyStyles.background}
    >
      <SafeAreaView style={MyStyles.container}>
        <View style={MyStyles.arrowHeader}>
          <TouchableOpacity
            style={MyStyles.arrowIcon}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-outline" size={30} color="black" />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.header}>Edit Pet Data</Text>
          </View>
          <View style={{ width: 35 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.sectionTitle}>Pet Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Pet Name"
            value={petName}
            onChangeText={setPetName}
          />
          <Text style={styles.sectionTitle}>Pet Breed:</Text>
          <TextInput
            style={styles.input}
            placeholder="Pet Breed"
            value={petBreed}
            onChangeText={setPetBreed}
          />
          <Text style={styles.sectionTitle}>Pet Type:</Text>
          <DropdownTypeComponent
            Item={{ type: petType }}
            setItem={(item) => setPetType(item.type)}
            currentPet={petType}
          />
          <Text style={styles.sectionTitle}>Pet Color:</Text>
          <TextInput
            style={styles.input}
            placeholder="Color"
            value={petColor}
            onChangeText={setPetColor}
          />
          <Text style={styles.sectionTitle}>Pet Weight:</Text>
          <TextInput
            style={styles.input}
            placeholder="Weight"
            value={weight}
            onChangeText={handleWeightChange}
            keyboardType="numeric"
          />
          <Text style={styles.sectionTitle}>Date of Birth:</Text>
          <TouchableOpacity
            style={styles.dateContainer}
            onPress={() => showMode("date")}
          >
            <Icon name="calendar" size={20} color="black" style={MyStyles.icon} />
            <TextInput
              style={MyStyles.input}
              placeholder="Date of Birth"
              value={selectedDate}
              editable={false}
            />
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
          <Text style={styles.sectionTitle}>Pet Gender:</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === "male" && styles.selectedRadio,
              ]}
              onPress={() => setGender("male")}
              value={gender}
            >
              <Text style={styles.radioText}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === "female" && styles.selectedRadio,
              ]}
              onPress={() => setGender("female")}
              value={gender}
            >
              <Text style={styles.radioText}>Female</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Living Environment:</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                environment === "outdoor" && styles.selectedRadio,
              ]}
              onPress={() => setEnvironment("outdoor")}
              value={environment}
            >
              <Text style={styles.radioText}>Outdoor</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                environment === "indoor" && styles.selectedRadio,
              ]}
              onPress={() => setEnvironment("indoor")}
              value={environment}
            >
              <Text style={styles.radioText}>Indoor</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionTitle}>Has your animal been neutered?</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                neutered === "yes" && styles.selectedRadio,
              ]}
              onPress={() => setNeutered("yes")}
              value={neutered}
            >
              <Text style={styles.radioText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                neutered === "no" && styles.selectedRadio,
              ]}
              onPress={() => setNeutered("no")}
              value={neutered}
            >
              <Text style={styles.radioText}>No</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EACEBE",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 25,
  },
  header: {
    fontSize: 24,
    justifyContent: "space-around",
    color: "black",
    textAlign: "center",
    textShadowColor: "#ab886d",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A4A4A",
  },
  dateContainer: {
    height: 49,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 5,
    backgroundColor: '#FFF',
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  radioButton: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#B6917B",
    backgroundColor: "#F5E4D8",
  },
  selectedRadio: {
    backgroundColor: "#B6917B",
    borderWidth: 1,
    borderColor: "black",
  },
  radioText: {
    marginLeft: 10,
    color: "black",
    fontWeight: "bold",
    alignItems: "center",
  },
  genderButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#B6917B",
    alignItems: "center",
    backgroundColor: "#F5E4D8",
  },
  genderText: {
    color: "#4A4A4A",
    fontWeight: "bold",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  petImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 5,
    elevation: 3,
  },
  editImageText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    height: 49,
    borderColor: "#B6917B",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#000',
    marginBottom: 5,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  dropdown: {
    height: 40,
    width: "100%",
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  genderOption: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#fff",
  },
  genderSelected: {
    backgroundColor: "#B6917B",
  },
  genderText: {
    color: "#000",
  },
  weightContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  weightInput: {
    flex: 1,
    marginRight: 10,
  },
  weightUnit: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: "#493628",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#fd7444",
  },
  buttonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
  datePicker: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#B6917B",
    borderRadius: 8,
    alignItems: "center",
  },
  dateText: {
    color: "#4A4A4A",
  },
});