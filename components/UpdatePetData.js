import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { editPet } from '../composable/putPetData';

export default function UpdatePetData({ route, navigation }) {
  const { pet } = route.params;
  const [petName, setPetName] = useState(pet.pet_name);
  const [petBreed, setPetBreed] = useState(pet.pet_breed);
  const [petType, setPetType] = useState(pet.pet_type);
  const [weight, setWeight] = useState(pet.weight.toString());
  const [image, setImage] = useState(pet.image);

  const handleSave = async () => {
    try {
      if (!pet.pet_id) {
        throw new Error("Pet ID is undefined");
      }
      const updatedPetData = {
        pet_name: petName,
        pet_breed: petBreed,
        pet_type: petType,
        weight: parseFloat(weight),
        image,
      };
      await editPet(pet.pet_id, updatedPetData);
      Alert.alert('Success', 'Pet updated successfully', [{ text: 'OK', onPress: () => navigation.navigate("Home") }]);
    } catch (error) {
      console.error('Error updating pet:', error);
      Alert.alert('Error', 'Failed to update pet');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Pet Data</Text>
      <TextInput
        style={styles.input}
        placeholder="Pet Name"
        value={petName}
        onChangeText={setPetName}
      />
      <TextInput
        style={styles.input}
        placeholder="Pet Breed"
        value={petBreed}
        onChangeText={setPetBreed}
      />
      <TextInput
        style={styles.input}
        placeholder="Pet Type"
        value={petType}
        onChangeText={setPetType}
      />
      <TextInput
        style={styles.input}
        placeholder="Weight"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={image}
        onChangeText={setImage}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#B6917B',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
});