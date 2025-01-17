import axios from 'axios';

// const baseUrl = "http://10.0.2.2:8080";
const baseUrl = "http://capstone24.sit.kmutt.ac.th:8080/kw2";

export const putAgenda = async (agendaId, eventTitle, eventDescription, eventStart, status) => {
  try {
    const response = await axios.put(
      `${baseUrl}/api/agendas/${agendaId}`,
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