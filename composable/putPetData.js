import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = "http://192.168.1.139:8080"; // Replace with your actual base URL

export const editPet = async (id, updatedPetData) => {
  try {
    const token = await AsyncStorage.getItem('userToken'); // Retrieve the token from AsyncStorage
    if (!token) {
      throw new Error('No token found');
    }

    const response = await axios.put(`${baseUrl}/api/pet/${id}`, updatedPetData, {
      headers: {
        Authorization: `Bearer ${token}` // Include the token in the request headers
      }
    });
    console.log('Pet updated successfully:', response.data);
    return response.data;
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
    console.error('Error config:', error.config);
    throw error;
  }
};