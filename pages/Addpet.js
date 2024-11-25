import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
// import { Picker } from "@react-native-picker/picker";
import { MyStyles } from "../styles/MyStyle";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropdownTypeComponent from "../components/DropdownTypePet";
export default function AddPet({
  navigation,
  setItems,
}) {
  const [Item, setItem] = useState({
    name: "",
    breed: "",
    type: "",
    color: "",
    weight: "",
    gender: null,
  });

  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const onChange = (event, selectedValue) => {
    if (event.type === "set") {
      if (mode === "date") {
        const currentDate = selectedValue || date;
        setDate(currentDate);
        setSelectedDate(currentDate.toISOString().split("T")[0]); // Format and store the date
      }
    }
    setShow(false); // Hide the picker after selection
  };

  const addPetInPet = async () => {
    if (
      !Item.name ||
      !Item.breed ||
      !Item.type ||
      !Item.color ||
      !Item.weight ||
      !Item.gender
    ) {
      showToast("error");
      return;
    }
    try {
      const response = await postAgenda(Item, selectedDate);
      const petId = response.pet_id;

      setItems((prevItems) => {
        const updatedItems = { ...prevItems };

        if (!updatedItems[selectedDate]) {
          updatedItems[selectedDate] = [];
        }

        updatedItems[selectedDate].push({
          ...Item,
          id: petId,
        });
        showToast("success");
        return updatedItems;
      });
      setItem({
        name: "",
        breed: "",
        type: "",
        color: "",
        weight: "",
        gender: "",
      });
    } catch (error) {
      console.error("Failed to add Pet:", error);
      showToast("error");
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.topNavBar}>
        <View style={MyStyles.header}></View>
      </SafeAreaView>

      <Text style={styles.header}>Add your pet!</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={Item.name}
        onChangeText={(text) => setItem({ ...Item, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Breed"
        value={Item.breed}
        onChangeText={(text) => setItem({ ...Item, breed: text })}
      />
      <DropdownTypeComponent
        style={styles.DropdownType}
        type={Item.type}
        Item={Item} setItem={setItem}
      />
      <TextInput
        style={styles.input}
        placeholder="Color"
        value={Item.color}
        onChangeText={(text) => setItem({ ...Item, color: text })}
      />
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[
            styles.genderButton,
            Item.gender === "male" && styles.selectedGender,
          ]}
          onPress={() => setItem({ ...Item, gender: "male" })}
        >
          <Text style={styles.genderText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.genderButton,
            Item.gender === "female" && styles.selectedGender,
          ]}
          onPress={() => setItem({ ...Item, gender: "female" })}
        >
          <Text style={styles.genderText}>Female</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Weight"
        value={Item.weight}
        keyboardType="numeric"
        onChangeText={(text) => setItem({ ...Item, weight: text })}
      />
      
      <TouchableOpacity
        style={MyStyles.dateContainer}
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
          value={mode === "date" ? date : time}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />

      )}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("Home");
          addPetInPet();
        }}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5E4D8",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#4A4A4A",
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#B6917B",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  genderButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#B6917B",
    alignItems: "center",
  },
  selectedGender: {
    backgroundColor: "#B6917B",
  },
  genderText: {
    color: "#4A4A4A",
    fontWeight: "bold",
  },
  datePicker: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#B6917B",
    borderRadius: 10,
    alignItems: "center",
  },
  dateText: {
    color: "#4A4A4A",
  },
  button: {
    backgroundColor: "#B6917B",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
