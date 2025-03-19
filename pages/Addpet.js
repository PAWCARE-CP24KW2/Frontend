import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  ImageBackground,
} from "react-native";
import { MyStyles } from "../styles/MyStyle";
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropdownTypeComponent from "../components/dropdowns/DropdownTypePet";
import { addPet } from "../api/pet/postPet";
import petplaceholder from "../assets/petplaceholder.png";
import { Ionicons } from "@expo/vector-icons";
import UploadModal from "../components/modals/UploadModal";
import ConfirmModal from "../components/modals/ConfirmModal";
import * as ImagePicker from "expo-image-picker";

export default function AddPet({ navigation }) {
  const [Item, setItem] = useState({
    name: "",
    breed: "",
    type: "",
    color: "",
    weight: "",
    environment: null,
    neutered: null,
    gender: null,
    profile_picture: null,
  });

  const FormData = global.FormData;
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("Upload pet's profile picture");
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [image, setImage] = useState();

  const onChange = (event, selectedValue) => {
    if (event.type === "set") {
      const currentDate = selectedValue || date;
      setDate(currentDate);
      // Format the date without timezone offset
      const formattedDate = new Date(
        currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];
      setSelectedDate(formattedDate); // Format and store the date
    }
    setShow(false); // Hide the picker after selection
  };

  const handleWeightChange = (text) => {
    // Allow only numeric input
    if (/^\d*\.?\d*$/.test(text)) {
      setItem({ ...Item, weight: text });
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const handleAddPet = async () => {
    try {
      const petData = {
        ...Item,
        weight: parseFloat(Item.weight), // Convert weight to a number
      };
      if (!Item.name) {
        Alert.alert("Error", "Please fill Pet Name");
        return;
      } else if (!Item.weight) {
        Alert.alert("Error", "Please fill Weight");
        return;
      } else if (!selectedDate) {
        Alert.alert("Error", "Please fill Date of Birth");
        return;
      }

      const formData = new FormData();
      formData.append("pet_name", petData.name);
      formData.append("pet_breed", petData.breed);
      formData.append("pet_type", petData.type);
      formData.append("pet_color", petData.color);
      formData.append("pet_gender", petData.gender);
      formData.append("pet_space", petData.environment);
      formData.append("pet_neutered", petData.neutered);
      formData.append("weight", petData.weight);
      formData.append("date_of_birth", selectedDate);

      if (image) {
        const uriParts = image.split(".");
        const fileType = uriParts[uriParts.length - 1];
        formData.append("profile_picture", {
          uri: image,
          name: `profile_picture.${fileType}`,
          type: `image/${fileType}`,
        });
      }
      
      const response = await addPet(formData);

      setItem({
        name: "",
        breed: "",
        type: "",
        color: "",
        weight: "",
        environment: null,
        neutered: null,
        gender: null,
        profile_picture: null,
      });
      setSelectedDate(null);

      navigation.navigate("HomeScreen", {
        pet: { ...petData, id: response.pet_id },
      });
    } catch (error) {
      console.error("Error adding pet:", error);
      Alert.alert("Error", "Failed to add pet");
    }
  };

  const uploadImage = async (mode) => {
    try {
      let result = {};

      if (mode === "gallery") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else if (mode === "camera") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.back,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      if (!result.canceled) {
        await saveImage(result.assets[0].uri);
      }
    } catch (error) {
      alert("Failed to upload image:", error.message);
      setModalVisible(false);
    }
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleDeletePress = () => {
    setModalDeleteVisible(true);
  };

  const handleConfirmDelete = () => {
    removeImage(image);
    setModalDeleteVisible(false);
  };

  const removeImage = async () => {
    try {
      setImage(null);
      setModalVisible(false);
    } catch ({ message }) {
      alert(message);
      setModalVisible(false);
    }
  };

  const saveImage = async (image) => {
    try {
      setImage(image);
      setModalVisible(false);
    } catch (error) {
      throw error;
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
            <Text style={styles.header}>Add your pet</Text>
          </View>
          <View style={{ width: 35 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.profile}>
            <View style={styles.imageContainer}>
              <TouchableOpacity onPress={handleOpenModal}>
                <Image
                  style={[styles.image, image && styles.imageWithBorder]}
                  source={image ? { uri: image } : petplaceholder}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.cameraIcon} onPress={handleOpenModal}>
                <Ionicons name="camera-outline" size={27} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.sectionTitle}>Pet Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={Item.name}
            onChangeText={(text) => setItem({ ...Item, name: text })}
          />
          <Text style={styles.sectionTitle}>Pet Breed:</Text>
          <TextInput
            style={styles.input}
            placeholder="Breed"
            value={Item.breed}
            onChangeText={(text) => setItem({ ...Item, breed: text })}
          />
          <Text style={styles.sectionTitle}>Pet Type:</Text>
          <DropdownTypeComponent
            style={styles.DropdownType}
            type={Item.type}
            Item={Item}
            setItem={setItem}
          />
          <Text style={styles.sectionTitle}>Pet Color:</Text>
          <TextInput
            style={styles.input}
            placeholder="Color"
            value={Item.color}
            onChangeText={(text) => setItem({ ...Item, color: text })}
          />
          <Text style={styles.sectionTitle}>Pet Weight:</Text>
          <TextInput
            style={styles.input}
            placeholder="Weight"
            value={Item.weight}
            keyboardType="numeric"
            onChangeText={handleWeightChange}
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
              value={mode === "date" ? date : time}
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
                Item.gender === "male" && styles.selectedRadio,
              ]}
              onPress={() => setItem({ ...Item, gender: "male" })}
            >
              <Text style={styles.genderText}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                Item.gender === "female" && styles.selectedRadio,
              ]}
              onPress={() => setItem({ ...Item, gender: "female" })}
            >
              <Text style={styles.genderText}>Female</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionTitle}>Living Environment:</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                Item.environment === "outdoor" && styles.selectedRadio,
              ]}
              onPress={() => setItem({ ...Item, environment: "outdoor" })}
            >
              <Text style={styles.radioText}>Outdoor</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                Item.environment === "indoor" && styles.selectedRadio,
              ]}
              onPress={() => setItem({ ...Item, environment: "indoor" })}
            >
              <Text style={styles.radioText}>Indoor</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionTitle}>Has your animal been neutered?</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                Item.neutered === "yes" && styles.selectedRadio,
              ]}
              onPress={() => setItem({ ...Item, neutered: "yes" })}
            >
              <Text style={styles.radioText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                Item.neutered === "No" && styles.selectedRadio,
              ]}
              onPress={() => setItem({ ...Item, neutered: "No" })}
            >
              <Text style={styles.radioText}>No</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleAddPet}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </ScrollView>

        <UploadModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          message={modalMessage}
          onCameraPress={() => uploadImage("camera")}
          onGalleryPress={() => uploadImage("gallery")}
          showRemoveButton={!!image}
          onRemovePress={handleDeletePress}
        />

        <ConfirmModal
          visible={modalDeleteVisible}
          onClose={() => setModalDeleteVisible(false)}
          onConfirm={handleConfirmDelete}
          message={`Are you sure you want to deleted ?`}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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
    textShadowColor: "#493628",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
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
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
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
  genderButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#B6917B",
    alignItems: "center",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  radioText: {
    marginLeft: 10,
    color: "black",
    fontWeight: "bold",
  },
  sectionTitle: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  genderText: {
    color: "black",
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
  button: {
    backgroundColor: "#493628",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  profile: {
    alignItems: "center",
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    width: 134,
    height: 134,
    textAlign: "center",
    borderRadius: 100,
    overflow: "hidden",
  },
  imageWithBorder: {
    borderWidth: 3,
    borderColor: "black",
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 4,
    borderWidth: 2,
  }
});