import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = "http://10.0.2.2:8080"; // Replace with your actual base URL

export const postLoginUser = async (userData) => {
  try {
    const response = await axios.post(`${baseUrl}/api/user/auth/login`, userData);
    const { token, refreshToken} = response.data;
    await AsyncStorage.setItem('userToken', token); // Store the token
    await AsyncStorage.setItem('refreshToken', refreshToken); // Store the refresh token
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