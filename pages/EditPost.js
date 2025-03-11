import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  Modal,
} from "react-native";
import { MyStyles } from "../styles/MyStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { getPostById } from "../api/post/getPostById.js";
import { updatePost } from "../api/post/updatePost.js";
import { showPostToast } from "../services/showToast.js";
import UploadModal from "../components/modals/UploadModal.js";
import ConfirmModal from "../components/modals/ConfirmModal.js";

export default function EditPost({ route, navigation }) {
  const { postId } = route.params;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("Upload image picture");
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [fullImageVisible, setFullImageVisible] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getPostById(postId);
        setTitle(post.post_title);
        setContent(post.post_content);
        setImage(post.post_photo_path ? { uri: post.post_photo_path } : null);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, [postId]);

  const handleUpdatePost = async () => {
    if (!title && !content) {
      showPostToast('fail');
      return;
    }

    try {
      const formData = new FormData();
      formData.append("post_title", title);
      formData.append("post_content", content);
      if (image) {
        formData.append("file", {
          uri: image.uri,
          type: image.type,
          name: image.name,
        });
      } else {
        formData.append("file", null);
      }
      await updatePost(postId, formData);
      navigation.goBack();
      showPostToast("update");
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const uploadImage = useCallback(async (mode) => {
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
        const { uri } = result.assets[0];
        const fileName = uri.split("/").pop();
        const fileType = fileName.split(".").pop();
        const image = {
          uri,
          name: fileName,
          type: `image/${fileType}`,
        };
        setImage(image);
      }
      setModalVisible(false);
    } catch (error) {
      alert("Failed to upload image:", error.message);
      setModalVisible(false);
    }
  }, []);

  const handleOpenModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleDeletePress = useCallback(() => {
    setModalDeleteVisible(true);
  }, []);

  const removeImage = useCallback(async () => {
    try {
      setImage(null);
      setModalVisible(false);
    } catch ({ message }) {
      alert(message);
      setModalVisible(false);
    }
  }, []);

  const handleConfirmDelete = useCallback(() => {
    removeImage(image);
    setModalDeleteVisible(false);
  }, [image, removeImage]);

  const handleImagePress = useCallback(() => {
    setFullImageVisible(true);
  }, []);

  const handleCloseFullImage = useCallback(() => {
    setFullImageVisible(false);
  }, []);

  return (
    <ImageBackground
      source={require("../assets/wallpaper.jpg")}
      style={MyStyles.background}
    >
      <SafeAreaView style={[MyStyles.container, { flex: 1 }]}>
        <View style={MyStyles.arrowHeader}>
          <TouchableOpacity
            style={MyStyles.arrowIcon}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-outline" size={30} color="black" />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.header}>Edit post</Text>
          </View>
          <View style={{ width: 35 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.sectionTitle}>Title</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="What would you like to share ?"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <Text style={styles.sectionTitle}>Content</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.contentInput}
              placeholder="Description"
              multiline={true}
              numberOfLines={6}
              value={content}
              onChangeText={setContent}
            />
            <TouchableOpacity
              style={styles.imageIcon}
              onPress={handleOpenModal}
            >
              <Ionicons name="image-outline" size={30} color="black" />
            </TouchableOpacity>
          </View>

          {image && (
            <TouchableOpacity onPress={handleImagePress}>
              <Image source={{ uri: image.uri }} style={styles.image} />
            </TouchableOpacity>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleUpdatePost}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
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
          message={`Are you sure you want to delete this image?`}
        />

        <Modal visible={fullImageVisible} transparent={true}>
          <View style={styles.fullImageContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseFullImage}
            >
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
            {image && (
              <Image source={{ uri: image.uri }} style={styles.fullImage} />
            )}
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
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
  inputContainer: {
    position: "relative",
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  input: {
    fontSize: 16,
    height: 49,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  contentInput: {
    fontSize: 16,
    height: 130,
    marginBottom: 5,
    borderRadius: 10,
    paddingHorizontal: 10,
    textAlignVertical: "top",
  },
  imageIcon: {
    position: "absolute",
    bottom: 0,
    right: 5,
    padding: 5,
    borderRadius: 50,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    marginBottom: 5,
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A4A4A",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  fullImageContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)", // Increased opacity
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "90%",
    height: "90%",
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
});