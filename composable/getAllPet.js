import axios from 'axios';

const baseUrl = 'http://192.168.1.139:8080/';

export const getAllPet = async () => {
  try {
    const url = `${baseUrl}api/pet/my?userId=2`;
    const response = await axios.get(url);
    // console.log('Response data:', response.data);
    const pets = response.data.map(pet => ({
      ...pet,
      date_of_birth: formatDate(new Date(pet.date_of_birth))
    }));
    return pets;
  } catch (err) {
    console.error('Error fetching data: ', err);
    throw err;
  }
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
