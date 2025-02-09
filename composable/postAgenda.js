import axios from 'axios';
import { BASE_URL } from '@env';

export const postAgenda = async (newItem, selectedDate, selectedTime) => {
  // Prepare the data to be sent to the backend
  const postData = {
    event_title: newItem.title,
    event_description: newItem.message,
    event_start: `${selectedDate}T${selectedTime}:00Z`,
    status: "Scheduled", // Adjust status if needed
  };

  try {
    const response = await axios.post(`${BASE_URL}/api/agendas/1/agendas`, postData);
    // console.log('Agenda added to backend:', response.data);
    return response.data; // Return the response from the backend if needed
  } catch (error) {
    console.error('Error adding agenda:', error);
    throw error; 
  }
};
