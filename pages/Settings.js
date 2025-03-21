import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground, 
  ScrollView , 
  Image ,
  Alert ,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MyStyles } from "../styles/MyStyle";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import petplaceholder from '../assets/petplaceholder.png';

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

  useEffect(() => {
    const getTokenData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        
        if (token) {
          const decodedToken = parseJWT(token);
          if (decodedToken.firstName) setFirstName(decodedToken.firstName);
          if (decodedToken.lastName) setLastName(decodedToken.lastName);
          if (decodedToken.email) setEmail(decodedToken.email);
          if (decodedToken.photo_path) setImage(decodedToken.photo_path);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    };

    getTokenData();
  }, []);


  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken'); // Clear the token
      Alert.alert("Success", "Logged out successfully", [
        { text: "OK", onPress: () => navigation.navigate('Auth', { screen: 'FirstPage' }) }
      ]);
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert("Error", "Failed to log out");
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete your account?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUserProfile();
              await AsyncStorage.removeItem('userToken'); // Clear the token
              Alert.alert("Success", "Account deleted successfully", [
                { text: "OK", onPress: () => navigation.navigate('Auth', { screen: 'FirstPage' }) }
              ]);
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert("Error", "Failed to delete account");
            }
          }
        }
      ]
    );
  };

  return (
    <ImageBackground
            source={require('../assets/wallpaper.jpg')}
            style={MyStyles.background}
          >
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.header}>Settings</Text>
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
          {/* <TouchableOpacity style={styles.item}>
            <Ionicons name="shield-outline" size={20} color="black" />
            <Text style={styles.itemText}>Security</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.item}
          onPress={() => Linking.openSettings()}
          >
            <Ionicons name="notifications-outline" size={20} color="black" />
            <Text style={styles.itemText}>Notifications</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.item}>
            <Ionicons name="lock-closed-outline" size={20} color="black" />
            <Text style={styles.itemText}>Privacy</Text>
          </TouchableOpacity> */}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <TouchableOpacity style={styles.item}
          onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="red" />
            <Text style={[styles.itemText, { color: 'red' }]}>Log out</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Ionicons name="trash-outline" size={20} color="red" />
            <Text style={[styles.itemText, { color: 'red' }]}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profile: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: 'gray',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  itemText: {
    fontSize: 16,
    marginLeft: 10,
  },
});
