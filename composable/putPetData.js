import axios from 'axios';

const baseUrl = 'http://192.168.1.139:8080';

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