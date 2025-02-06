import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, } from 'react-native';

export default function Settings({ navigation }) {

 

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Settings Screen </Text>
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
  },
  buttonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
});
