import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = "http://192.168.1.139:8080"; // Replace with your actual base URL

export const addPet = async (Item, selectedDate) => {
  console.log('hello');
  
  // Prepare the data to be sent to the backend
  const postData = {
    pet_name: Item.name,
    pet_breed: Item.breed,
    pet_type: Item.type,
    pet_color: Item.color,
    pet_gender: Item.gender,
    pet_space: Item.environment,
    pet_neutered: Item.neutered,
    weight: parseFloat(Item.weight),
    date_of_birth: selectedDate,
  };
  
  console.log('Sending data to backend:', postData); // Log the data being sent

  try {
    const token = await AsyncStorage.getItem('userToken'); // Retrieve the token from AsyncStorage
    const response = await axios.post(`${baseUrl}/api/pet/addPet`, postData, {
      headers: {
        Authorization: `Bearer ${token}` // Include the token in the request headers
      }
    });
    console.log('Pet added to backend:', response.data);
    return response.data; // Return the response from the backend if needed
  } catch (error) {
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request data:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};