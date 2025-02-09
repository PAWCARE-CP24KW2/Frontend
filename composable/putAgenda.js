import axios from 'axios';
import { BASE_URL } from '@env';

export const putAgenda = async (agendaId, eventTitle, eventDescription, eventStart, status) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/agendas/${agendaId}`,
      {
        event_title: eventTitle,
        event_description: eventDescription,
        event_start: eventStart, 
        status: status || 'Scheduled',
      }
    );

    if (response.status === 200) {
      // console.log('Agenda updated successfully:', response.data);
    } else {
      console.error('Failed to update agenda:', response.data.error);
    }
  } catch (error) {
    console.error('Error updating agenda:', error.message);
  }
};