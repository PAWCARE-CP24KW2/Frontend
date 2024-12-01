import axios from 'axios';

// const baseUrl = "http://10.0.2.2:8080";
const baseUrl = "http://capstone24.sit.kmutt.ac.th:8080/kw2";

export const postAgenda = async (newItem, selectedDate, selectedTime) => {
  // Prepare the data to be sent to the backend
  const postData = {
    event_title: newItem.title,
    event_description: newItem.message,
    event_start: `${selectedDate}T${selectedTime}:00Z`,
    status: "Scheduled", // Adjust status if needed
  };

  try {
    const response = await axios.post(`${baseUrl}/api/agendas/1/agendas`, postData);
    // console.log('Agenda added to backend:', response.data);
    return response.data; // Return the response from the backend if needed
  } catch (error) {
    console.error('Error adding agenda:', error);
    throw error; 
  }
};
