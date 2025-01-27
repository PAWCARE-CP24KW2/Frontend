import axios from 'axios';

const baseUrl = "http://10.0.2.2:8080";
// const baseUrl = "http://capstone24.sit.kmutt.ac.th:8080/kw2";

export const fetchAgendas = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/agendas`);
    const agendas = response.data;

    if (!Array.isArray(agendas) || agendas.length === 0) {
      return {}; 
    }

    const transformedAgendas = {};
    agendas.forEach(agenda => {
      const date = agenda.appointment.split('T')[0];
      const time = agenda.appointment.split('T')[1].split(':').slice(0, 2).join(':');
      if (!transformedAgendas[date]) {
        transformedAgendas[date] = [];
      }
      transformedAgendas[date].push({
        id: agenda.agenda_id,
        title: agenda.agenda_title,
        message: agenda.agenda_message,
        status: agenda.status,
        time: time,
      });
    });
    
    return transformedAgendas;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      console.warn('No agendas found. Returning an empty object.');
      return {}; // Handle the 404 error specifically by returning an empty object
    }
    console.error('Error fetching data:', err);
    throw err
  }
}