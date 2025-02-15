import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';

export const getDocument = async (petId, fileType) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${BASE_URL}/api/image/${petId}/getFilePath/${fileType}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if(error.response.status === 404) {
      return null;
    } else {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } 
    throw error;
  }
};