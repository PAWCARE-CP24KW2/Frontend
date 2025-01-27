import axios from 'axios';

const baseUrl = "http://10.0.2.2:8080";
// const baseUrl = "http://capstone24.sit.kmutt.ac.th:8080/kw2";

export const editPet = async (id, updatedPetData) => {
  try {
    const response = await axios.put(`${baseUrl}/api/pet/${id}`, updatedPetData);
    console.log('Pet updated successfully:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request data:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    console.error('Error config:', error.config);
    throw error;
  }
};