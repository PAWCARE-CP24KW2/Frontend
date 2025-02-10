import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = "http://192.168.1.139:8080"; // Replace with your actual base URL

function parseJWT(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export const getPetsByUserId = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken'); // Retrieve the token from AsyncStorage
    if (!token) {
      throw new Error('No token found');
    }

    const decodedToken = parseJWT(token); // Decode the token to get user_id
    console.log('decodedToken:', decodedToken);
    const userId = decodedToken.userId; // Assuming the token contains a 'user_id' field

    const response = await axios.get(`${baseUrl}/api/pet/myPet`, {
      headers: {
        Authorization: `Bearer ${token}` // Include the token in the request headers
      },
      params: {
        userId: userId
      }
    });

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
    throw error;
  }
};