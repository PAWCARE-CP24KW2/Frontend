import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ImageBackground,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MyStyles } from "../styles/MyStyle";
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import UploadModal from "../components/modals/UploadModal";
import ConfirmModal from "../components/modals/ConfirmModal";
import { updateUserProfile } from '../api/user/updateUserProfile';
import { updateUserPhoto } from '../api/user/updateUserPhoto';
import { deleteUserProfile } from '../api/user/deleteUserProfile';
import { getUser } from '../api/user/getUser';
import { showUpdateUserToast } from '../services/showToast';

function parseJWT(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export default function EditUserProfile({ navigation }) {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("Upload profile picture");
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);

  useEffect(() => {
    const getTokenData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const decodedToken = parseJWT(token);
          const userId = decodedToken.userId;
          const userData = await getUser(userId);
          console.log('Edit User data:', userData);
          if (userData.user_id) setUserId(userData.user_id);
          if (userData.username) setUserName(userData.username);
          if (userData.user_firstname) setFirstName(userData.user_firstname);
          if (userData.user_lastname) setLastName(userData.user_lastname);
          if (userData.user_phone) setPhone(userData.user_phone);
          if (userData.email) setEmail(userData.email);
          if (userData.photo_path) setImage(userData.photo_path);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getTokenData();
  }, []);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const updatedUserData = {
        userId,
        username: userName,
        user_firstname: firstName,
        user_lastname: lastName,
        user_phone: phone,
        email,
      };
      await updateUserProfile(updatedUserData);
      showUpdateUserToast('success');
      navigation.navigate('Settings')
    } catch (error) {
      console.error("Error updating profile:", error);
      showUpdateUserToast('error');
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
      await updateUserPhoto(formData);

      Alert.alert("Success", "Profile picture updated successfully");
    } catch (error) {
      console.error('Error uploading profile image:', error.response ? error.response.data : error.message);
      alert("Failed to upload image");
    }
  };

  const removeImage = async () => {
    try {
      setImage(null);
      setModalVisible(false);
      await deleteUserProfile();
      Alert.alert("Success", "Profile picture deleted successfully");
    } catch ({ message }) {
      alert(message);
      setModalVisible(false);
    }
  };

  const handleDeletePress = () => {
    setModalDeleteVisible(true);
  };

  const handleConfirmDelete = () => {
    removeImage(image);
    setModalDeleteVisible(false);
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
            <Text style={styles.header}>Edit User Profile</Text>
          </View>
          <View style={{ width: 35 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.profile}>
            <View style={styles.imageContainer}>
              <TouchableOpacity onPress={handleOpenModal}>
                <Image
                  style={[styles.image, image && styles.imageWithBorder]}
                  source={image ? { uri: image } : require('../assets/petplaceholder.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.cameraIcon} onPress={handleOpenModal}>
                <Ionicons name="camera-outline" size={27} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Firstname:</Text>
          <TextInput
            style={styles.input}
            placeholder="Firstname"
            value={firstName}
            onChangeText={setFirstName}
          />
          <Text style={styles.sectionTitle}>Lastname:</Text>
          <TextInput
            style={styles.input}
            placeholder="Lastname"
            value={lastName}
            onChangeText={setLastName}
          />
          <Text style={styles.sectionTitle}>Phone:</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <Text style={styles.sectionTitle}>Email:</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
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
          message={`Are you sure you want to delete?`}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EACEBE",
  },
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
  profile: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  imageWithBorder: {
    borderWidth: 2,
    borderColor: '#B6917B',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 4,
    borderWidth: 2,
  },
  sectionTitle: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A4A4A",
  },
  input: {
    height: 49,
    borderColor: "#B6917B",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 5,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
});