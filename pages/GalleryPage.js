import React, { useEffect, useState } from "react";
import { View, Text, Image, ImageBackground, TouchableOpacity, StyleSheet, FlatList, RefreshControl, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { MyStyles } from "../styles/MyStyle";
import getGallery from "../api/pet/gallery/getGallery";
import postGallery from '../api/pet/gallery/postGallery';
import ImageViewer from "react-native-image-zoom-viewer";
import addImageButton from "../assets/addImageButton.png";
import UploadModal from "../components/modals/UploadModal"; // Import the UploadModal component
import * as ImagePicker from "expo-image-picker";

export default function GalleryPage({ navigation, route }) {
  const { petId, petName } = route.params;
  const FormData = global.FormData;
  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fullImageVisible, setFullImageVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("Upload an image");

  const fetchGalleryData = async () => {
    try {
      const galleryData = await getGallery(petId);
      setGalleryData(galleryData);
    } catch (error) {
      console.error("Failed to fetch gallery data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGalleryData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGalleryData();
  };

  const handleImagePress = (imageUri) => {
    setSelectedImage(imageUri); 
    setFullImageVisible(true);
  };

  const handleCloseFullImage = () => {
    setFullImageVisible(false);
    setSelectedImage(null);
  };

  const uploadImage = async (mode) => {
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
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          quality: 1,
        });
      }

      if (!result.canceled) {
        const formData = new FormData();
        formData.append("gallery_image", {
          uri: result.assets[0].uri,
          name: `gallery_${Date.now()}.jpg`,
          type: "image/jpeg",
        });
  
        const response = await postGallery(petId, formData);
        console.log("Image uploaded successfully:", response);
  
        setModalVisible(false);
        fetchGalleryData();
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
      setModalVisible(false);
    }
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const renderImageItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleImagePress(item.gallery_path)}
      style={styles.imageContainer}
    >
      <Image source={{ uri: item.gallery_path }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../assets/wallpaper.jpg")}
      style={styles.background}
    >
      <SafeAreaView style={MyStyles.container}>
        <View style={MyStyles.arrowHeader}>
          <TouchableOpacity
            style={MyStyles.arrowIcon}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-outline" size={30} color="white" />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={styles.headerText}>{`${petName}'s Gallery`}</Text>
          </View>

          <TouchableOpacity
            style={styles.moreOptionsIcon}
            onPress={() => console.log("More options pressed")}
          >
            <Ionicons name="ellipsis-vertical" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : galleryData.length > 0 ? (
          <FlatList
            data={galleryData}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => item.gallery_id.toString()}
            numColumns={2}
            contentContainerStyle={styles.galleryList}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <Text style={styles.noDataText}>No images available.</Text>
        )}

        <Modal visible={fullImageVisible} transparent={true} animationType="fade">
          <ImageViewer
            imageUrls={galleryData.map((item) => ({ url: item.gallery_path }))} 
            enableSwipeDown={true}
            onSwipeDown={handleCloseFullImage}
            index={galleryData.findIndex((item) => item.gallery_path === selectedImage)}
            renderHeader={(currentIndex) => (
              <View style={styles.headerFullImageContainer}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleCloseFullImage}
                >
                  <Ionicons name="close" size={30} color="white" />
                </TouchableOpacity>
              </View>
            )}
          />
        </Modal>

        <TouchableOpacity
          style={styles.createPetButton}
          onPress={handleOpenModal}
        >
          <Image source={addImageButton} style={styles.addIcon} />
        </TouchableOpacity>

        <UploadModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          message={modalMessage}
          onCameraPress={() => uploadImage("camera")}
          onGalleryPress={() => uploadImage("gallery")}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  headerText: {
    fontSize: 24,
    fontFamily: "ComfortaaBold",
    color: "white",
    textAlign: "center",
  },
  moreOptionsIcon: {
    padding: 5,
    // backgroundColor: "blue",
  },
  loadingText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
  noDataText: {
    fontSize: 18,
    color: "#000",
    textAlign: "center",
    marginTop: 20,
  },
  galleryList: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  imageContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  fullImageContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "90%",
    height: "90%",
    resizeMode: "contain",
  },
  headerFullImageContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 1,
    alignItems: "flex-end",
    padding: 10,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 10,
  },
  createPetButton: {
    position: 'absolute',
    backgroundColor: "#71543F",
    borderRadius: 100,
    padding: 12,
    bottom: 10,
    right: 10,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addIcon: {
    width: 46,
    height: 46,
  },
});