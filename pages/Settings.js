import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground, 
  ScrollView , 
  Image ,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MyStyles } from "../styles/MyStyle";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import petplaceholder from '../assets/petplaceholder.png';
import getUser from '../api/user/getUser';
import { useFocusEffect } from '@react-navigation/native';
import { showLogOutToast , showDelUserToast } from '../services/showToast';
import ConfirmModal from "../components/modals/ConfirmModal";
import { deleteUser } from '../api/user/deleteUser';

function parseJWT(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export default function Settings({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const decodedToken = parseJWT(token);
        const userId = decodedToken.userId;
        const userData = await getUser(userId);
        if (userData.user_firstname) setFirstName(userData.user_firstname);
        if (userData.user_lastname) setLastName(userData.user_lastname);
        if (userData.email) setEmail(userData.email);
        if (userData.photo_path) setImage(userData.photo_path);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken'); // Clear the token
      showLogOutToast('success');
      navigation.navigate('Auth', { screen: 'FirstPage' }) 
    } catch (error) {
      console.error('Error logging out:', error);
      showLogOutToast('error');
    }
  };

  const handleDeleteAccount = () => {
    setModalDeleteVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser();
      await AsyncStorage.removeItem('userToken'); // Clear the token
      showDelUserToast('success');
      navigation.navigate('Auth', { screen: 'FirstPage' });
    } catch (error) {
      console.error('Error deleting account:', error);
      showDelUserToast('error');
    } finally {
      setModalDeleteVisible(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/wallpaper.jpg')}
      style={MyStyles.background}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Settings</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.section}>
            <View style={styles.profile}>
              <Image
                style={styles.image}
                source={image ? { uri: image } : petplaceholder}
              />
              <Text style={styles.name}>{firstName} {lastName}</Text>
              <Text style={styles.email}>{email}</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <TouchableOpacity 
              style={styles.item}
              onPress={() => navigation.navigate('EditUserProfile')}
            >
              <Ionicons name="person-outline" size={20} color="black" />
              <Text style={styles.itemText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item}
              onPress={() => Linking.openSettings()}
            >
              <Ionicons name="notifications-outline" size={20} color="black" />
              <Text style={styles.itemText}>Notifications</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actions</Text>
            <TouchableOpacity style={styles.item}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color="red" />
              <Text style={[styles.itemText, { color: 'red' }]}>Log out</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item}
              onPress={handleDeleteAccount}
            >
              <Ionicons name="trash-outline" size={20} color="red" />
              <Text style={[styles.itemText, { color: 'red' }]}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <ConfirmModal
          visible={modalDeleteVisible}
          onClose={() => setModalDeleteVisible(false)}
          onConfirm={handleConfirmDelete}
          message={`Are you sure you want to delete your account?`}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    height: 65,
    backgroundColor: "#493628",
  },
  headerText: {
    fontSize: 30,
    fontFamily: "ComfortaaBold",
    textAlign: "center",
    color: "white",
    includeFontPadding: false,
  },
  section: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "ComfortaaBold",
    marginBottom: 10,
  },
  profile: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "black",
  },
  name: {
    fontSize: 20,
    fontFamily: "ComfortaaBold",
  },
  email: {
    fontSize: 16,
    fontFamily: "Comfortaa",
    color: 'gray',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  itemText: {
    fontSize: 16,
    fontFamily: "ComfortaaBold",
    marginLeft: 10,
  },
});