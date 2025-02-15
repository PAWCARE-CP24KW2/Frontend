import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { MyStyles } from "../styles/MyStyle";
import Ionicons from "@expo/vector-icons/Ionicons";
import UploadModal from "../components/UploadModal";
import * as ImagePicker from "expo-image-picker";
import ShowDocumentModal from "../components/ShowDocumentModal";
import ConfirmModal from "../components/ConfirmModal";
import { showUploadDocToast } from "../composable/showToast";
import { uploadRegistration } from "../uploadMinio/uploadRegistration";
import { uploadMedicalBook } from "../uploadMinio/uploadMedicalBook";
import { uploadPassport } from "../uploadMinio/uploadPassport";
import { deleteDocument } from "../uploadMinio/deleteDocument";
import { getDocument } from "../uploadMinio/getDocument";
import { useFocusEffect } from "@react-navigation/native";

export default function Documents({ navigation, route }) {
  const { petId } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showDocumentModalVisible, setShowDocumentModalVisible] = useState(false);
  const [image, setImage] = useState();
  const [registrationImage, setRegistrationImage] = useState(null);
  const [medicalBookImage, setMedicalBookImage] = useState(null);
  const [passportImage, setPassportImage] = useState(null);

  const fetchDocuments = async () => {
    console.log(!registrationImage);
    try {
      if (!registrationImage) {
        const registrationResponse = await getDocument(petId, 'registration');
        setRegistrationImage(registrationResponse.file_path);
      }

      if (!medicalBookImage) {
        const medicalBookResponse = await getDocument(petId, 'medicalbook');
        setMedicalBookImage(medicalBookResponse.file_path);
      }

      if (!passportImage) {
        const passportResponse = await getDocument(petId, 'passportno');
        setPassportImage(passportResponse.file_path);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDocuments();
    }, [petId])
  );

  const uploadImage = async (setImage, mode) => {
    try {
      let result = {};

      if (mode === "gallery") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          quality: 1,
        });
      } else if (mode === "camera") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.back,
          allowsEditing: true,
          quality: 1,
        });
      }

      if (!result.canceled) {
        await saveImage(result.assets[0].uri, setImage);
      }
    } catch (error) {
      alert("Failed to upload image:", error.message);
      setModalVisible(false);
    }
  };

  const saveImage = async (uri, setImage) => {
    let response;
    try {
      if (setImage === setRegistrationImage) {
        response = await uploadRegistration(petId, uri);
        setRegistrationImage(response.file.url);
        showUploadDocToast("Registration No.", 'upload');
      } else if (setImage === setMedicalBookImage) {
        response = await uploadMedicalBook(petId, uri);
        setMedicalBookImage(response.file.url);
        showUploadDocToast("Medical book", 'upload');
      } else if (setImage === setPassportImage) {
        response = await uploadPassport(petId, uri);
        setPassportImage(response.file.url);
        showUploadDocToast("Passport No.", 'upload');
      }
      setModalVisible(false);
    } catch (error) {
      throw error;
    }
  };

  const removeImage = async (setImage) => {
    try {
      if (setImage === setRegistrationImage) {
        setRegistrationImage(null);
        await deleteDocument(petId, "registration");
        showUploadDocToast("Registration No.", 'delete');
      } else if (setImage === setMedicalBookImage) {
        setMedicalBookImage(null);
        await deleteDocument(petId, "medicalbook");
        showUploadDocToast("Medical book", 'delete');
      } else if (setImage === setPassportImage) {
        setPassportImage(null);
        await deleteDocument(petId, "passportno");
        showUploadDocToast("Passport No.", 'delete');
      }
      setModalVisible(false);
    } catch ({ message }) {
      alert(message);
      setModalVisible(false);
    }
  };

  const handleDeletePress = (message) => {
    setModalMessage(message);
    setModalDeleteVisible(true);
  };

  const handleOpenModal = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleShowDocument = (showSelected) => {
    setShowDocumentModalVisible(true);
    if (showSelected === registrationImage) {
      setImage(registrationImage);
    } else if (showSelected === medicalBookImage) {
      setImage(medicalBookImage);
    } else if (showSelected === passportImage) {
      setImage(passportImage);
    }
  };

  const handleConfirmDelete = () => {
    if (modalMessage.includes("Registration")) {
      removeImage(setRegistrationImage);
    } else if (modalMessage.includes("Medical")) {
      removeImage(setMedicalBookImage);
    } else if (modalMessage.includes("Passport")) {
      removeImage(setPassportImage);
    }
    setModalDeleteVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#EACEBE" }}>
      <SafeAreaView style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </SafeAreaView>

      <View style={MyStyles.modal}>
        <Text style={{ fontSize: 27, textAlign: "center", paddingTop: 4 }}>
          Documents
        </Text>
        <Text
          style={{
            fontSize: 15,
            textAlign: "center",
            paddingVertical: 5,
            marginBottom: 15,
          }}
        >
          Record important documents here
        </Text>

        <TouchableOpacity style={styles.card} onPress={() => handleShowDocument(registrationImage)}>
          <Ionicons name="folder" size={26} color="black" />
          <Text style={[styles.cardText, registrationImage && styles.underlineText]}>
            Registration No.
          </Text>
          {registrationImage ? (
            <TouchableOpacity style={styles.addButton} onPress={() => handleDeletePress("Registration No.")}>
              <Ionicons name="trash-outline" size={24} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.addButton} onPress={() => handleOpenModal("Upload Registration No.")}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => handleShowDocument(medicalBookImage)}>
          <Ionicons name="folder" size={26} color="black" />
          <Text  style={[styles.cardText, medicalBookImage && styles.underlineText]}>
            Medical Book
          </Text>
          {medicalBookImage ? (
            <TouchableOpacity style={styles.addButton} onPress={() => handleDeletePress("Medical Book")}>
              <Ionicons name="trash-outline" size={24} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.addButton} onPress={() => handleOpenModal("Upload Medical Book")}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => handleShowDocument(passportImage)}>
          <Ionicons name="folder" size={26} color="black" />
          <Text style={[styles.cardText, passportImage && styles.underlineText]}>
            Passport No.
          </Text>
          {passportImage ? (
            <TouchableOpacity style={styles.addButton} onPress={() => handleDeletePress("Passport No.")}>
              <Ionicons name="trash-outline" size={24} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.addButton} onPress={() => handleOpenModal("Upload Passport No.")}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        <View>
          <UploadModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            message={modalMessage}
            onCameraPress={() => {
              if (modalMessage.includes("Registration")) {
                uploadImage(setRegistrationImage, "camera");
              } else if (modalMessage.includes("Medical")) {
                uploadImage(setMedicalBookImage, "camera");
              } else if (modalMessage.includes("Passport")) {
                uploadImage(setPassportImage, "camera");
              }
            }}
            onGalleryPress={() => {
              if (modalMessage.includes("Registration")) {
                uploadImage(setRegistrationImage, "gallery");
              } else if (modalMessage.includes("Medical")) {
                uploadImage(setMedicalBookImage, "gallery");
              } else if (modalMessage.includes("Passport")) {
                uploadImage(setPassportImage, "gallery");
              }
            }}
            onRemovePress={handleDeletePress}
            showRemoveButton={
              modalMessage.includes("Registration")
                ? !!registrationImage
                : modalMessage.includes("Medical")
                ? !!medicalBookImage
                : !!passportImage
            }
          />
        </View>

        <View>
          <ShowDocumentModal
            visible={showDocumentModalVisible}
            onClose={() => setShowDocumentModalVisible(false)}
            uri={image}
          />
        </View>

        <View>
          <ConfirmModal
            visible={modalDeleteVisible}
            onClose={() => setModalDeleteVisible(false)}
            onConfirm={handleConfirmDelete}
            message={`Are you sure you want to deleted ${modalMessage}?`}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#B6917B",
    padding: 17,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 15,
    marginVertical: 10,
  },
  cardText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  underlineText: {
    textDecorationLine: "underline",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EACEBE",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  uploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#493628",
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 13,
    color: "#FFF",
    fontWeight: "bold",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#B6917B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    paddingTop: 50,
  },
  backButton: {
    marginRight: 16,
  },
});