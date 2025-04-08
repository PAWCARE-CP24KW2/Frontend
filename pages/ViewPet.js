import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MyStyles } from "../styles/MyStyle";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native";
import AlertModal from "../components/modals/AlertModal";
import { getQRcode } from "../api/pet/getQRcode";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

export default function ViewPet({ route, navigation }) {
  const FormData = global.FormData;
  const [items, setItems] = useState([]);
  const { pet } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("Upload profile picture");
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [modalDeletePetVisible, setModalDeletePetVisible] = useState(false);
  const [image, setImage] = useState(pet.profile_path);
  const [recordsModalVisible, setRecordsModalVisible] = useState(false);
  const [qrCodeModalVisible, setQRCodeModalVisible] = useState(false);
  const [qrCodeImage, setQRCodeImage] = useState(null);
  const [loadingQRCode, setLoadingQRCode] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

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
    setModalDeletePetVisible(true);
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
      console.error(
        "Error uploading profile image:",
        error.response ? error.response.data : error.message
      );
      showUploadPhotoToast("error");
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

  const handleOpenQRCodeModal = async () => {
    setQRCodeModalVisible(true);
    setLoadingQRCode(true);
    try {
      const qrCodeData = await getQRcode(pet.pet_id);
      setQRCodeImage(qrCodeData.qr_code_base64);
    } catch (error) {
      console.error("Failed to fetch QR code:", error);
    } finally {
      setLoadingQRCode(false);
    }
  };

  const handleDownloadQRCode = async () => {
    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        alert("Permission to access media library is required!");
        return;
      }
  
      const fileUri = `${FileSystem.documentDirectory}QRCode.png`;
      await FileSystem.writeAsStringAsync(fileUri, qrCodeImage.split(",")[1], {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("Download", asset, false);
      setAlertVisible(true);
    } catch (error) {
      console.error("Failed to download QR Code:", error);
      alert("Failed to download QR Code.");
    }
  };

  const handleCloseQRCodeModal = () => {
    setQRCodeModalVisible(false);
    setQRCodeImage(null);
  };

  return (
    <ImageBackground
      source={require("../assets/wallpaper.jpg")}
      style={MyStyles.background}
    >
      <StatusBar backgroundColor="transparent" style="dark" />
      <SafeAreaView style={MyStyles.container}>
        <View style={MyStyles.arrowHeader}>
          <TouchableOpacity
            style={MyStyles.arrowIcon}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-outline" size={30} color="white" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerText}>Pet's Details</Text>
          </View>
          <View style={{ width: 35 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.section}>
            <View style={styles.profile}>
              <View style={styles.imageContainer}>
                <TouchableOpacity onPress={handleOpenModal}>
                  <Image
                    style={[styles.image, image && styles.imageWithBorder]}
                    source={image ? { uri: image } : petplaceholder}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cameraIcon}
                  onPress={handleOpenModal}
                >
                  <Ionicons name="camera-outline" size={27} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.header}>
              {capitalizeFirstLetter(pet.pet_name) || "Pet Name"}
            </Text>

            <Text style={styles.sectionTitle}>Actions</Text>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.item} onPress={handleEdit}>
              <Ionicons name="pencil-outline" size={25} color="black" />
              <Text style={styles.itemText}>Edit Pet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={confirmDelete}>
              <Ionicons name="trash-outline" size={25} color="red" />
              <Text style={[styles.itemText, { color: "red" }]}>
                Delete Pet
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>More Options</Text>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate("Calendar")}
            >
              <Ionicons name="calendar-outline" size={25} color="black" />
              <Text style={styles.itemText}>Calendar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.item}
              onPress={handleOpenRecordsModal}
            >
              <Ionicons name="document-text-outline" size={25} color="black" />
              <Text style={styles.itemText}>Records</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                navigation.navigate("Gallery", {
                  petId: pet.pet_id,
                  petName: pet.pet_name,
                })
              }
            >
              <Ionicons name="images-outline" size={25} color="black" />
              <Text style={styles.itemText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                navigation.navigate("Home", {
                  screen: "Documents",
                  params: { petId: pet.pet_id },
                })
              }
            >
              <Ionicons name="folder-outline" size={25} color="black" />
              <Text style={styles.itemText}>Documents</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={handleOpenQRCodeModal}>
              <Ionicons name="qr-code-outline" size={25} color="black" />
              <Text style={styles.itemText}>QR Code</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

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
          onConfirm={handleConfirmDelete}
          message={`Are you sure you want to delete this Photo pet?`}
        />

        <ConfirmModal
          visible={modalDeletePetVisible}
          onClose={() => setModalDeletePetVisible(false)}
          onConfirm={handleDelete}
          message={`Are you sure you want to delete this pet?`}
        />

        <AlertModal
          visible={alertVisible}
          onClose={() => setAlertVisible(false)}
          onConfirm={() => setAlertVisible(false)}
          message="QR Code downloaded successfully."
          buttonText="OK"
        />

        <Modal
          visible={qrCodeModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCloseQRCodeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {loadingQRCode ? (
                <ActivityIndicator size="large" color="#000" />
              ) : qrCodeImage ? (
                <>
                  <Image source={{ uri: qrCodeImage }} style={styles.qrCodeImage} />
                  <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadQRCode}>
                      <Text style={styles.downloadButtonText}>Download</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton} onPress={handleCloseQRCodeModal}>
                      <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <Text style={styles.errorText}>Failed to load QR Code</Text>
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontFamily: "ComfortaaBold",
    color: "white",
    textAlign: "center",
  },
  section: {
    backgroundColor: "#F5F5F5",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    fontSize: 28,
    fontFamily: "ComfortaaBold",
    justifyContent: "space-around",
    color: "black",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "ComfortaaBold",
    marginBottom: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#bdbdbd',
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  itemText: {
    fontSize: 16,
    fontFamily: "ComfortaaBold",
    marginLeft: 10,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    width: "80%",
  },
  qrCodeImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  closeButton: {
    backgroundColor: "#493628",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    margin: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "ComfortaaBold",
  },
  downloadButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    margin: 5,
    alignItems: "center",
  },
  downloadButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "ComfortaaBold",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 20,
  },
});
