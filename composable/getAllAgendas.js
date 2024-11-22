import axios from 'axios';

const baseUrl = 'http://192.168.1.106:8080'

export const fetchAgendas = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/agendas/pet/1`);
    const agendas = response.data;

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
    console.error('Error fetching data:', err);
    throw err
  }
}