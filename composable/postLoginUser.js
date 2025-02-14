import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env'; 

export const postLoginUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/user/auth/login`, userData);
    const { token, refreshToken} = response.data;
    console.log('Login response token:', token);
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