import axios from 'axios';
import { BASE_URL } from '@env'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAgendaFromId = async (id) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('No token found');
    }
    const response = await axios.get(`${BASE_URL}/api/agendas/${id}`, {
      headers: {
        Authorization: `Bearer ${token}` // Include the token in the request headers
      }
    });
    return response.data
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err
  }
}