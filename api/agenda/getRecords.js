import axios from "axios";
import { BASE_URL } from '@env'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getRecords = async (petId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('No token found');
    }
    const response = await axios.get(`${BASE_URL}/api/pet/${petId}/expiredAgendas`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching records:", error.response ? error.response.data : error.message);
    throw error;
  }
};