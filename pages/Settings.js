import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode'; // Ensure this import is correct

export default function Settings({ navigation }) {
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const getTokenData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const decodedToken = jwt_decode(token);
          console.log('Decoded Token:', decodedToken); // Log the decoded token
          setFirstName(decodedToken.user_firstname); // Assuming the token contains a 'user_firstname' field
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
        { text: "OK", onPress: () => navigation.navigate('Home', { screen: 'FirstPage' }) }
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
        onPress={() => navigation.navigate('Home', { screen: 'Documents' })}
      >
        <Text style={styles.buttonText}>Documents Page</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home', { screen: 'ViewPet' })}
      >
        <Text style={styles.buttonText}>ViewPet Page</Text>
      </TouchableOpacity>

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