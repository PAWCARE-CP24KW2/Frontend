import axios from 'axios';
import { BASE_URL } from '@env'; 

export const getAgendaFromId = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/agendas/${id}`);
    return response.data
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err
  }
}