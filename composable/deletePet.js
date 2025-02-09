import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env'; 

export const deletePet = async (id) => {
  try {
    const token = await AsyncStorage.getItem('userToken'); // Retrieve the token from AsyncStorage
    if (!token) {
      throw new Error('No token found');
    }

    const response = await axios.delete(`${BASE_URL}/api/pet/${id}`, {
      headers: {
        Authorization: `Bearer ${token}` // Include the token in the request headers
      }
    });
    console.log("Deleted pet from backend:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Error request data:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message:", error.message);
    }
    console.error("Error config:", error.config);
    throw error;
  }
};