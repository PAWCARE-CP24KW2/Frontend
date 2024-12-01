import axios from 'axios';

// const baseUrl = "http://10.0.2.2:8080";
const baseUrl = "http://capstone24.sit.kmutt.ac.th:8080/kw2";

export const addPet = async (Item, selectedDate) => {
  // Prepare the data to be sent to the backend
  const postData = {
    pet_export : 1,
    pet_name: Item.name,
    pet_breed: Item.breed,
    pet_type: Item.type,
    pet_color: Item.color,
    pet_gender: Item.gender,
    pet_space: Item.environment,
    pet_neutered: Item.neutered,
    weight: parseFloat(Item.weight),
    date_of_birth: selectedDate,
  };
  
  console.log('Sending data to backend:', postData); // Log the data being sent

  try {
    const response = await axios.post(`${baseUrl}/api/pet/addPet`, postData);
    console.log('Pet added to backend:', response.data);
    return response.data; // Return the response from the backend if needed
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error adding Pet:', error.response.data);
      console.error('Status code:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    throw error; 
  }
};

