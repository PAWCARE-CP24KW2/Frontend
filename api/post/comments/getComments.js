import axios from 'axios';
import { BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getComments = async (postId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('No token found');
    }
    const response = await axios.get(`${BASE_URL}/api/post/comment/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export default getComments;