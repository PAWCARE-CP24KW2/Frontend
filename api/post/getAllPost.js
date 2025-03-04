import axios from 'axios';
import { BASE_URL } from '@env'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAllPost = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
          throw new Error('No token found');
      }
      const response = await axios.get(`${BASE_URL}/api/post/getPost`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      throw error;
    }
  };