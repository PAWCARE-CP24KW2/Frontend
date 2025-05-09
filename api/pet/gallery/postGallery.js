import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';

const postGallery = async (petId, formData) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.post(`${BASE_URL}/api/pet/gallery/${petId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
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

export default postGallery;