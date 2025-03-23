import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MyStyles } from "../styles/MyStyle";
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPetByPetId } from "../api/pet/getPetByPetId";
import { deletePet } from "../api/pet/deletePet";
import petplaceholder from "../assets/petplaceholder.png";
import UploadModal from "../components/modals/UploadModal";
import ConfirmModal from "../components/modals/ConfirmModal";
import * as ImagePicker from "expo-image-picker";
import { updatePetProfile } from "../api/pet/updatePetProfile";
import { deletePetProfile } from "../api/pet/deletePetProfile";
import RecordsModal from "./Records";
import { showDelPetToast } from "../services/showToast";

export default function ViewPet({ route, navigation }) {
  const FormData = global.FormData;
  const [items, setItems] = useState([]);
  const { pet } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("Upload profile picture");
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [image, setImage] = useState(pet.profile_path);
  const [recordsModalVisible, setRecordsModalVisible] = useState(false);

  useEffect(() => {
    const getPets = async () => {
      try {
        const pets = await getPetByPetId(pet.pet_id);
        setItems(pets);
      } catch (error) {
        console.error("Failed to fetch pets in component:", error);
      }
    };
    getPets();
  }, []);

  const handleDelete = async () => {
    try {
      await deletePet(pet.pet_id);
      showDelPetToast(pet.pet_name);
      navigation.goBack();
    } catch (error) {
      console.error("Failed to delete pet:", error);
    }
  };

  const confirmDelete = () => {
    setModalDeleteVisible(true);
  };

  const handleEdit = () => {
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
      deletePetProfile(pet.pet_id);
    } catch ({ message }) {
      setModalVisible(false);
    }
  };

  const saveImage = async (image) => {
    try {
      setImage(image);
      setModalVisible(false);
      
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const formData = new FormData();
      formData.append("file", {
        uri: image,
        name: `file.${fileType}`,
        type: `image/${fileType}`,
      });
      await updatePetProfile(pet.pet_id, formData);

    } catch (error) {
      console.error('Error uploading profile image:', error.response ? error.response.data : error.message);
      showUploadPhotoToast('error');
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleOpenRecordsModal = () => {
    setRecordsModalVisible(true);
  };

  const handleCloseRecordsModal = () => {
    setRecordsModalVisible(false);
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
        </View>

        <SafeAreaView style={styles.container}>

          <Text style={styles.header}>{capitalizeFirstLetter(pet.pet_name) || "Pet Name"}</Text>

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

          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={handleEdit}>
              <Ionicons name="pencil-outline" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={confirmDelete}>
              <Ionicons name="trash-outline" size={30} color="black" />
            </TouchableOpacity>
          </View>

          {/* Action Grid */}
          <View style={styles.gridContainer}>
            <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate("Calendar")}>
              <Ionicons name="calendar-outline" size={40} color="black" />
              <Text style={styles.gridText}>Calendar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridItem} onPress={handleOpenRecordsModal}>
              <Ionicons name="document-text-outline" size={40} color="black" />
              <Text style={styles.gridText}>Records</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridItem}>
              <Ionicons name="images-outline" size={40} color="black" />
              <Text style={styles.gridText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => navigation.navigate("Home", { screen: "Documents", params: {petId: pet.pet_id} })}
            >
              <Ionicons name="folder-outline" size={40} color="black" />
              <Text style={styles.gridText}>Documents</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <RecordsModal
          visible={recordsModalVisible}
          onClose={handleCloseRecordsModal}
          petId={pet.pet_id}
        />

        <UploadModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          message={modalMessage}
          onCameraPress={() => uploadImage("camera")}
          onGalleryPress={() => uploadImage("gallery")}
          showRemoveButton={!!pet.profile_path}
          onRemovePress={handleDeletePress}
        />

        <ConfirmModal
          visible={modalDeleteVisible}
          onClose={() => setModalDeleteVisible(false)}
          onConfirm={handleDelete}
          message={`Are you sure you want to delete this pet?`}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
  },
  profile: {
    alignItems: "center",
    marginVertical: 5,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: 134,
    height: 134,
    textAlign: "center",
    borderRadius: 100,
    overflow: "hidden",
    backgroundColor: "white",
  },
  imageWithBorder: {
    borderWidth: 3,
    borderColor: "black",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 3,
    right: 3,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 4,
    borderWidth: 2,
  },
  infoContainer: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    justifyContent: "space-around",
    color: "black",
    textAlign: "center",
    marginBottom: 10,
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
    alignSelf: "center",
    width: "60%",
    marginTop: 15,
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
    marginTop: 10,
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