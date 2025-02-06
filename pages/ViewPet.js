import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MyStyles } from "../styles/MyStyle";
import { getAllPet } from "../composable/getAllPet";
import { deletePet } from "../composable/deletePet";
import petplaceholder from '../assets/petplaceholder.png';
import UploadModal from "../components/UploadModal";
import ConfirmModal from "../components/ConfirmModal";
import * as ImagePicker from "expo-image-picker";
import { showUploadProToast } from "../composable/showToast";

export default function ViewPet({ route,navigation }) {

  const [items, setItems] = useState([]);
  const { pet } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("Upload profile picture");
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [image, setImage] = useState();

  useEffect(() => {
    const getPets = async () => {
      try {
        const pets = await getAllPet();
        // console.log("Response data:", pets);
        setItems(pets);
      } catch (error) {
        console.error("Failed to fetch pets in component:", error);
      }
    };
    getPets();
  }, []);
  
  const handleDelete = async () => {
    try {
      // console.log("Pet data:", pet); // Log the pet data
      await deletePet(pet.pet_id);
      Alert.alert("Success", "Pet deleted successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Failed to delete pet:", error);
      Alert.alert("Error", "Failed to delete pet");
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this pet?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Delete", onPress: handleDelete }
      ],
      { cancelable: false }
    );
  };

  const handleEdit = () => {
    console.log("Edit pet data:", pet);
    
    navigation.navigate("UpdatePetData", { pet });
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
      showUploadProToast("Pet profile picture", "delete");
    } catch ({ message }) {
      alert(message);
      setModalVisible(false);
    }
  };

  const saveImage = async (image) => {
    try {
      setImage(image);
      setModalVisible(false);
      showUploadProToast("Pet profile picture", "upload");
    } catch (error) {
      throw error;
    }
  }

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <SafeAreaView style={styles.topNavBar}>
        <View style={MyStyles.header}>
          <TouchableOpacity
            style={{ marginRight: 12 }}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={45} color="black" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <SafeAreaView style={styles.container}>
      {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{pet.pet_name || "Pet Name"}</Text>
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
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={handleEdit}>
              <Ionicons name="pencil-outline" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="download-outline" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={confirmDelete}>
              <Ionicons name="trash-outline" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Action Grid */}
        <View style={styles.gridContainer}>
          <TouchableOpacity style={styles.gridItem}>
            <Ionicons name="calendar-outline" size={40} color="black" />
            <Text style={styles.gridText}>Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem}>
            <Ionicons name="people-outline" size={40} color="black" />
            <Text style={styles.gridText}>Users</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem}>
            <Ionicons name="document-text-outline" size={40} color="black" />
            <Text style={styles.gridText}>Records</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem}>
            <Ionicons name="images-outline" size={40} color="black" />
            <Text style={styles.gridText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem}>
            <Ionicons name="folder-outline" size={40} color="black" />
            <Text style={styles.gridText}>Documents</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

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
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 134,
    height: 134,
    textAlign: "center",
    borderRadius: 100,
    overflow: 'hidden',
    marginTop: 15,
    backgroundColor: 'white',
  },
  imageWithBorder: {
    borderWidth: 3,
    borderColor: 'black',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 4,
    borderWidth: 2
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
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
    marginTop: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "black",
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
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
    marginTop: 10,
    backgroundColor: "#B6917B",
    padding: 10,
    borderRadius: 10,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    width: "100%",
    paddingHorizontal: 20,
  },
  gridItem: {
    width: "40%",
    aspectRatio: 1,
    backgroundColor: "#B6917B",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  gridText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
});
