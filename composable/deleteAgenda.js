import axios from "axios";
import { BASE_URL } from '@env'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export const deleteAgenda = async (id) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await axios.delete(`${BASE_URL}/api/agendas/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("Deleted agenda from backend:", response.data);
    return response.data; 
  } catch (error) {
    console.error("Error deleting agenda:", error);
    throw error; 
  }
};
