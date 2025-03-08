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
} from "react-native";
import { MyStyles } from "../styles/MyStyle";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { createPost } from '../api/post/postPost';
import { showCreatePost } from "../services/showToast.js";

export default function AddPost({ navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  const handleAddPost = async () => {
    if (!title && !content) {
      showCreatePost('fail');
      return;
    }

    try {
      await createPost(title, content, file);
      navigation.goBack();
      showCreatePost('success');
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
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
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            <Text style={styles.imagePickerText}>Pick an image</Text>
          </TouchableOpacity>
          {file && <Image source={{ uri: file.uri }} style={styles.image} />}
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleAddPost}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
      height: 200,
      borderRadius: 8,
      marginVertical: 10,
    },
  });