import axios from 'axios';
import { BASE_URL } from '@env';

export const postUser = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/user/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request data:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    console.log("Error in frontend/composable/postUser.js");
    throw error;
  }
};