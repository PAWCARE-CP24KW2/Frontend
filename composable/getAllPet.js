import axios from 'axios';

// const baseUrl = "http://10.0.2.2:8080";
const baseUrl = "http://capstone24.sit.kmutt.ac.th:8080/kw2";

export const getAllPet = async () => {
  try {
    const url = `${baseUrl}/api/pet/pets`;
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
