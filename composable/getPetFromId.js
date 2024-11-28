import axios from 'axios';

const baseUrl = 'http://192.168.1.139:8080'

export const getPetFromId = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/api/pet/${id}`);
    return response.data
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err
  }
}