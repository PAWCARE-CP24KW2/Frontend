import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { postUser } from "../api/user/postUser";
import { MyStyles } from "../styles/MyStyle";
import petplaceholder from "../assets/petplaceholder.png";
import UploadModal from "../components/modals/UploadModal";
import ConfirmModal from "../components/modals/ConfirmModal";
import * as ImagePicker from "expo-image-picker";

export default function CreateAccountScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  //Profile image
  const FormData = global.FormData;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("Upload profile picture");
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [image, setImage] = useState();

  const handleContinue = async () => {
    if (!firstname || !lastname || !username || !password || !confirmPassword || !email || !phone) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("user_firstname", firstname);
    formData.append("user_lastname", lastname);
    formData.append("user_phone", phone);

    if (image) {
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];
      formData.append("profile_user", {
        uri: image,
        name: `profile_user.${fileType}`,
        type: `image/${fileType}`,
      });
    }

    try {
      await postUser(formData);
      Alert.alert("Success", "Account created successfully", [
        { text: "OK", onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to create account");
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
    } catch (error) {
      throw error;
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

  return (
    <ImageBackground
      source={require('../assets/wallpaper.jpg')}
      style={MyStyles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>

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

        <Text style={styles.label}>First Name</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#555"
            value={firstname}
            onChangeText={setFirstname}
          />
        </View>

        <Text style={styles.label}>Last Name</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#555"
            value={lastname}
            onChangeText={setLastname}
          />
        </View>

        <Text style={styles.label}>Username</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#555"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="********"
            placeholderTextColor="#555"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="********"
            placeholderTextColor="#555"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Email</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="jane@example.com"
            placeholderTextColor="#555"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <Text style={styles.label}>Phone</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="xxxxxxxxxx"
            placeholderTextColor="#555"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TouchableOpacity style={styles.RegisButton} onPress={handleContinue}>
          <Text style={styles.register}>CONTINUE</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>OR HAVE ACCOUNT ?</Text>
        </TouchableOpacity>

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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#493628",
    marginBottom: 10,
    textShadowColor: "#ab886d",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
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
    borderWidth: 2,
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
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    color: "#493628",
    fontWeight: "bold",
    marginLeft: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingVertical: 12,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  inputPassword: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingVertical: 12,
  },
  eyeIcon: {
    padding: 10,
  },
  RegisButton: {
    backgroundColor: "#493628",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  register: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  linkText: {
    fontSize: 14,
    color: "#000",
    marginTop: 10,
  },
});