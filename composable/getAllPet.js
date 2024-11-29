import axios from 'axios';

const baseUrl = 'http://192.168.1.139:8080/';

export const getAllPet = async () => {
  try {
    const url = `${baseUrl}api/pet/my?userId=2`;
    const response = await axios.get(url);
    console.log('Response data:', response.data);
    return response.data;
  } catch (err) {
    console.error('Error fetching data: ', err);
    throw err;
  }
};