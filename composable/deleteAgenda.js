import axios from "axios";
import { BASE_URL } from '@env'; 

export const deleteAgenda = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/agendas/${id}`);
    console.log("Deleted agenda from backend:", response.data);
    return response.data; 
  } catch (error) {
    console.error("Error deleting agenda:", error);
    throw error; 
  }
};
