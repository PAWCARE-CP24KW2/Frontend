import axios from 'axios';
import { BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const postAgenda = async (newItem, selectedDate, selectedTime, petId) => {
  const postData = {
    event_title: newItem.title,
    event_description: newItem.message,
    event_start: `${selectedDate}T${selectedTime}:00Z`,
    status: "Scheduled", // Adjust status if needed
  };

  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.post(`${BASE_URL}/api/agendas/${petId}/agendas`, postData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding agenda:', error);
    throw error; 
  }
};
