import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';

export const uploadPassport = async (petId, fileUri) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const formData = new FormData();
    const uriParts = fileUri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    formData.append('file', {
      uri: fileUri,
      name: `passport.${fileType}`,
      type: `image/${fileType}`,
    });

    const response = await axios.post(`${BASE_URL}/api/image/${petId}/uploadPassportNo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
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