import axios from 'axios';

const baseUrl = 'http://192.168.1.139:8080'

export const getAgendaFromId = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/api/agendas/${id}`);
    return response.data
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err
  }
}