import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
} from 'react-native';
import { editPet } from '../composable/putPetData';
import DropdownTypeComponent from '../components/DropdownTypePet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MyStyles } from '../styles/MyStyle';

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

  const [selectedDate, setSelectedDate] = useState(pet.date_of_birth.split("T")[0]);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(pet.date_of_birth));
  const [mode, setMode] = useState("date")

  const onChange = (event, selectedValue) => {
    if (event.type === "set") {
      const currentDate = selectedValue || date;
      setDate(currentDate.date_of_birth);
      // Format the date without timezone offset
      const formattedDate = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000))
        .toISOString()
        .split('T')[0];
      setSelectedDate(formattedDate); // Format and store the date
    }
    setShow(false); // Hide the picker after selection
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const handleSave = async () => {
    try {
      if (!pet.pet_id) {
        throw new Error("Pet ID is undefined");
      } else if (!petName) {
        Alert.alert('Error', 'Pet Name Cannot be Empty');
        return;
      } else if (!weight) {
        Alert.alert('Error', 'Weight Cannot be Empty');
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
        date_of_birth: selectedDate.split('T')[0],
        image,
      }
      console.log('Sending updated pet data:', selectedDate);
      await editPet(pet.pet_id, updatedPetData);
      Alert.alert('Success', 'Pet updated successfully', [{ text: 'OK', onPress: () => navigation.navigate("Home") }]);
    } catch (error) {
      console.error('Error updating pet:', error);
      Alert.alert('Error', 'Failed to update pet');
    }
  };

  const handleWeightChange = (text) => {
    // Allow only numeric input
    if (/^\d*\.?\d*$/.test(text)) {
      setWeight(text);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.topNavBar}>
        <View style={MyStyles.header}></View>
      </SafeAreaView>
      <Text style={styles.title}>Edit Pet Data</Text>
      <TouchableOpacity
      style={styles.imageContainer}
      value={image}
      onChangeText={setImage}
      >
       <Image
          style={styles.image}
          source={{
            uri: pet.image || "https://via.placeholder.com/80",
          }}
        /> 
      </TouchableOpacity>
      
      <TextInput
        style={styles.input}
        placeholder="Pet Name"
        value={petName}
        onChangeText={setPetName}
      />
      <DropdownTypeComponent
        Item={{ type: petType }}
        setItem={(item) => setPetType(item.type)}
        currentPet={petType}
      />
      <TextInput
        style={styles.input}
        placeholder="Pet Breed"
        value={petBreed}
        onChangeText={setPetBreed}
      />
      <TextInput
        style={styles.input}
        placeholder="Color"
        value={petColor}
        onChangeText={setPetColor}
      />
      <TextInput
        style={styles.input}
        placeholder="Weight"
        value={weight}
        onChangeText={handleWeightChange}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={MyStyles.dateContainer}
        onPress={() => showMode("date")}
      >
        <TextInput
          style={styles.input}
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
      <Text style={styles.sectionTitle}>Gender:</Text>
      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === "male" && styles.selectedGender,
          ]}
          onPress={() => setGender("male")}
          value={gender}
        >
          <Text style={styles.genderText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === "female" && styles.selectedGender,
          ]}
          onPress={() => setGender("female")}
          value={gender}
        >
          <Text style={styles.genderText}>Female</Text>
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
            neutered === true && styles.selectedRadio,
          ]}
          onPress={() => setNeutered(true)}
          value={neutered}
        >
          <Text style={styles.radioText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.radioButton,
            neutered === false && styles.selectedRadio,
          ]}
          onPress={() => setNeutered(false)}
          value={neutered}
        >
          <Text style={styles.radioText}>No</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F2E5E1',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 10,
    alignItems: 'center',

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    marginBottom: 5,
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A4A4A",
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
  },
  selectedRadio: {
    backgroundColor: "#B6917B",
  },
  radioText: {
    marginLeft: 10,
    color: "#4A4A4A",
    fontWeight: "bold",
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
  genderText: {
    color: "#4A4A4A",
    fontWeight: "bold",
  },
  selectedGender: {
    backgroundColor: "#B6917B",
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  petImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
    elevation: 3,
  },
  editImageText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  dropdown: {
    height: 40,
    width: '100%',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  genderOption: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#fff',
  },
  genderSelected: {
    backgroundColor: '#B6917B',
  },
  genderText: {
    color: '#000',
  },
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  weightInput: {
    flex: 1,
    marginRight: 10,
  },
  weightUnit: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#B6917B',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
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
});