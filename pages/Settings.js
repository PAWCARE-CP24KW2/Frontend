import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  useEffect(() => {
    const getTokenData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const decodedToken = parseJWT(token);
          console.log('Decoded Token:', decodedToken); // Log the decoded token
          if (decodedToken.user_firstname) {
            setFirstName(decodedToken.user_firstname); // Assuming the token contains a 'user_firstname' field
          } else {
            console.error('user_firstname not found in token');
          }
        } else {
          console.error('No token found');
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

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Settings Screen, {firstName}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EACEBE',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: "#B6917B",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
});