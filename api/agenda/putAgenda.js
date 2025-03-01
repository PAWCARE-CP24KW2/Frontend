import axios from "axios";
import { BASE_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const putAgenda = async (agendaId, eventTitle, eventDescription, eventStart, status) => {
  try {
    const token = await AsyncStorage.getItem('userToken'); // Retrieve the token from AsyncStorage
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await axios.put(
      `${BASE_URL}/api/agendas/${agendaId}`,
      {
        event_title: eventTitle,
        event_description: eventDescription,
        event_start: eventStart,
        status: status || "Scheduled",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      // console.log('Agenda updated successfully:', response.data);
    } else {
      console.error("Failed to update agenda:", response.data.error);
    }
  } catch (error) {
    console.error("Error updating agenda:", error.message);
  }
};
