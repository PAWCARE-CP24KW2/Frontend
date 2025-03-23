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
import { showUpdatePetToast } from '../services/showToast';

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
        showUpdatePetToast("error name");
        return;
      } else if (!weight) {
        showUpdatePetToast("error weight");
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
      showUpdatePetToast("success");
      navigation.navigate("HomeScreen") 
    
    } catch (error) {
      console.error("Error updating pet:", error);
      showUpdatePetToast("error");
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
      <SafeAreaView style={styles.container}>
        <View style={MyStyles.arrowHeader}>
          <TouchableOpacity
            style={MyStyles.arrowIcon}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-outline" size={30} color="black" />
          </TouchableOpacity>
          <View style={{ flex: 1}}>
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
                styles.radioButton,
                gender === "male" && styles.selectedRadio,
              ]}
              onPress={() => setGender("male")}
              value={gender}
            >
              <Text style={[styles.radioText, gender === "male" && styles.selectedRadioText]}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                gender === "female" && styles.selectedRadio,
              ]}
              onPress={() => setGender("female")}
              value={gender}
            >
              <Text style={[styles.radioText, gender === "female" && styles.selectedRadioText]}>Female</Text>
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
              <Text style={[styles.radioText, environment === "outdoor" && styles.selectedRadioText]}>Outdoor</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                environment === "indoor" && styles.selectedRadio,
              ]}
              onPress={() => setEnvironment("indoor")}
              value={environment}
            >
              <Text style={[styles.radioText, environment === "indoor" && styles.selectedRadioText]}>Indoor</Text>
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
              <Text style={[styles.radioText, neutered === "yes" && styles.selectedRadioText]}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                neutered === "no" && styles.selectedRadio,
              ]}
              onPress={() => setNeutered("no")}
              value={neutered}
            >
              <Text style={[styles.radioText, neutered === "no" && styles.selectedRadioText]}>No</Text>
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
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontFamily: "ComfortaaBold",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "ComfortaaBold",
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
    backgroundColor: "#71543F",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  selectedRadioText: {
    color: "#FFF",
  },
  radioText: {
    marginLeft: 10,
    color: "black",
    fontFamily: "ComfortaaBold",
  },
  input: {
    fontFamily: "ComfortaaBold",
    height: 49,
    borderColor: "#B6917B",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#000',
    marginBottom: 5,
    paddingHorizontal: 12,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
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