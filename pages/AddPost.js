import React, { useState } from "react";
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { createPost } from '../api/post/postPost';
import { showCreatePost } from "../services/showToast.js";
import UploadModal from "../components/modals/UploadModal.js";
import ConfirmModal from "../components/modals/ConfirmModal.js";

export default function AddPost({ navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("Upload image picture");
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [fullImageVisible, setFullImageVisible] = useState(false);

  const handleAddPost = async () => {
    if (!title && !content) {
      showCreatePost('fail');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('post_title', title);
      formData.append('post_content', content);
      if (image) {
        formData.append('file', {
          uri: image.uri,
          type: image.type,
          name: image.name,
        });
      }
      await createPost(formData);
      navigation.goBack();
      showCreatePost('success');
    } catch (error) {
      console.error("Error adding post:", error);
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
          // aspect: [1, 1],
          quality: 1,
        });
      } else if (mode === "camera") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.back,
          allowsEditing: true,
          // aspect: [1, 1],
          quality: 1,
        });
      }

      if (!result.canceled) {
        const { uri } = result.assets[0];
        const fileName = uri.split('/').pop();
        const fileType = fileName.split('.').pop();
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
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleDeletePress = () => {
    setModalDeleteVisible(true);
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

  const handleConfirmDelete = () => {
    removeImage(image);
    setModalDeleteVisible(false);
  };

  const handleImagePress = () => {
    setFullImageVisible(true);
  };

  const handleCloseFullImage = () => {
    setFullImageVisible(false);
  };

  return (
    <ImageBackground
      source={require('../assets/wallpaper.jpg')}
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
            <Text style={styles.header}>Create post</Text>
          </View>
          <View style={{ width: 35 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.sectionTitle}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="What would you like to share ?"
            value={title}
            onChangeText={setTitle}
          />
          <Text style={styles.sectionTitle}>Content</Text>
          <TextInput
            style={styles.contentInput}
            placeholder="Description"
            multiline={true}
            numberOfLines={6}
            value={content}
            onChangeText={setContent}
          />
          <TouchableOpacity style={styles.imagePicker} onPress={handleOpenModal}>
            <Text style={styles.imagePickerText}>Pick an image</Text>
          </TouchableOpacity>
          {image && (
            <TouchableOpacity onPress={handleImagePress}>
              <Image source={{ uri: image.uri }} style={styles.image} />
            </TouchableOpacity>
          )}
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleAddPost}>
              <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
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
          message={`Are you sure you want to deleted ?`}
        />

        <Modal visible={fullImageVisible} transparent={true}>
          <View style={styles.fullImageContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseFullImage}>
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
            {image && <Image source={{ uri: image.uri }} style={styles.fullImage} />}
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
  },
  input: {
    fontSize: 16,
    height: 49,
    borderColor: "#B6917B",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#000',
    marginBottom: 5,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
  },
  contentInput: {
    fontSize: 16,
    height: 130,
    borderColor: "#B6917B",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#000',
    marginBottom: 5,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
    textAlignVertical: 'top',
  },
  sectionTitle: {
    marginBottom: 5,
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A4A4A",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: "#493628",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#fd7444",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  imagePicker: {
    backgroundColor: "#B6917B",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  imagePickerText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  fullImageContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)', // Increased opacity
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
});