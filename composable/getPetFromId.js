import axios from 'axios';

// const baseUrl = "http://10.0.2.2:8080";
const baseUrl = "http://capstone24.sit.kmutt.ac.th:8080/kw2";

export const getPetFromId = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/api/pet/${id}`);
    return response.data
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err
  }
}