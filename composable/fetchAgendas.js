import axios from 'axios';

const baseUrl = 'http://192.168.1.106:8080'

export const fetchAgendas = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/pet/1/agendas`);
    return response.data
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err
  }
}