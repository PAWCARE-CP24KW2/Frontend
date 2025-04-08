import React, { useEffect, useState, useRef } from "react";
import { Animated, Easing } from "react-native";
import { View, Text, Image, ImageBackground, TouchableOpacity, StyleSheet, FlatList, RefreshControl, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { MyStyles } from "../styles/MyStyle";
import getGallery from "../api/pet/gallery/getGallery";
import postGallery from '../api/pet/gallery/postGallery';
import ImageViewer from "react-native-image-zoom-viewer";
import addImageButton from "../assets/addImageButton.png";
import UploadModal from "../components/modals/UploadModal";
import * as ImagePicker from "expo-image-picker";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { deleteGalleryImage } from "../api/pet/gallery/deleteGallery";
import ConfirmModal from "../components/modals/ConfirmModal";
import { StatusBar } from "expo-status-bar";

export default function GalleryPage({ navigation, route }) {
  const { petId, petName } = route.params;
  const FormData = global.FormData;
  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [fullImageVisible, setFullImageVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("Upload an image");
  const [deleteMode, setDeleteMode] = useState(false);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [galleryIdToDelete, setGalleryIdToDelete] = useState(null);

  const fetchGalleryData = async () => {
    try {
      const galleryData = await getGallery(petId);
      const sortedData = galleryData.sort((a, b) =>
        new Date(a.created_at) - new Date(b.created_at)
      );
      setGalleryData(sortedData);
    } catch (error) {
      console.error("Failed to fetch gallery data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    const sortedData = [...galleryData].sort((a, b) =>
      newSortOrder === "asc"
        ? new Date(a.created_at) - new Date(b.created_at)
        : new Date(b.created_at) - new Date(a.created_at)
    );
    setGalleryData(sortedData);
  };

  const startShaking = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 1,
          duration: 50,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -1,
          duration: 50,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 50,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopShaking = () => {
    shakeAnimation.stopAnimation(); 
    shakeAnimation.setValue(0);
  };

  useEffect(() => {
    if (deleteMode) {
      startShaking();
    } else {
      stopShaking();
    }
  }, [deleteMode]);

  useEffect(() => {
    fetchGalleryData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setDeleteMode(false);
    fetchGalleryData();
  };

  const handleOpenModal = () => {
    setModalVisible(true);
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
      
        setModalVisible(false);
        fetchGalleryData();
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
      setModalVisible(false);
    }
  };

  const handleDeleteImage = (gallery_id) => {
    setGalleryIdToDelete(gallery_id);
    setConfirmModalVisible(true);
  };

  const confirmDeleteImage = async () => {
    try {
      if (galleryIdToDelete) {
        await deleteGalleryImage(galleryIdToDelete);
        fetchGalleryData();
      }
    } catch (error) {
      console.error("Failed to delete image:", error);
    } finally {
      setConfirmModalVisible(false); 
      setGalleryIdToDelete(null);
    }
  };

  const renderImageItem = ({ item }) => {
    const shakeStyle = {
      transform: [
        {
          rotate: shakeAnimation.interpolate({
            inputRange: [-5, 5],
            outputRange: ["-2deg", "2deg"],
          }),
        },
      ],
    };

    return (
      <Animated.View style={[styles.imageContainer, deleteMode && shakeStyle]}>
        <TouchableOpacity onPress={() => handleImagePress(item.gallery_path)}>
          <Image source={{ uri: item.gallery_path }} style={styles.image} />
        </TouchableOpacity>
        {deleteMode && (
          <TouchableOpacity
            style={styles.deleteIcon}
            onPress={() => handleDeleteImage(item.gallery_id)}
          >
            <Ionicons name="close-circle" size={24} color="red" />
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  };

  return (
    <ImageBackground
      source={require("../assets/wallpaper.jpg")}
      style={styles.background}
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
            <Text style={styles.headerText}>{`${petName}'s Gallery`}</Text>
          </View>

          <TouchableOpacity style={styles.moreOptionsIcon}>
            <Menu>
              <MenuTrigger>
                <Ionicons name="ellipsis-vertical" size={24} color="white" />
              </MenuTrigger>
              <MenuOptions>
                <MenuOption onSelect={handleSort}>
                  <View style={styles.menuOption}>
                    <Ionicons name="swap-vertical-outline" size={24} color="black" />
                    <Text style={styles.menuOptionText}>{`Order by ${sortOrder}`}</Text>
                  </View>
                </MenuOption>
                <MenuOption onSelect={() => setDeleteMode(!deleteMode)}>
                  <View style={styles.menuOption}>
                    <Ionicons name="trash-outline" size={24} color="red" />
                    <Text style={styles.menuOptionDeleteText}>Delete</Text>
                  </View>
                </MenuOption>
              </MenuOptions>
            </Menu>
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
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No images available.</Text>
          </View>
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

        <ConfirmModal
          visible={confirmModalVisible}
          onClose={() => setConfirmModalVisible(false)}
          onConfirm={confirmDeleteImage}
          message="Are you sure you want to delete this image?"
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
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuOptionText: {
    fontSize: 18,
    fontFamily: "ComfortaaBold",
    marginLeft: 10,
    color: "black",
  },
  menuOptionDeleteText: {
    fontSize: 18,
    fontFamily: "ComfortaaBold",
    marginLeft: 10,
    color: "red",
  },
  loadingText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    position: "relative",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  deleteIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 2,
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