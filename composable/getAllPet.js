import axios from 'axios';

const baseUrl = "http://192.168.1.139:8080";
// const baseUrl = "http://capstone24.sit.kmutt.ac.th:8080/kw2";

export const getAllPet = async () => {
  try {
    const url = `${baseUrl}/api/pet/`;
    const response = await axios.get(url);
    const pets = response.data.map(pet => ({
      ...pet,
      date_of_birth: formatDate(new Date(pet.date_of_birth))
    }));
    return pets;
  } catch (err) {
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', err.response.data);
      console.error('Error response status:', err.response.status);
      console.error('Error response headers:', err.response.headers);
    } else if (err.request) {
      // The request was made but no response was received
      console.error('Error request data:', err.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', err.message);
    }
    console.error('Error:', err.config);
    throw err;
  }
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
