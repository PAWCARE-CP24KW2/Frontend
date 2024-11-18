import axios from "axios";

const baseUrl = "http://192.168.1.106:8080";

export const deleteAgenda = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/api/agendas/${id}`);
    console.log("Deleted agenda from backend:", response.data);
    return response.data; 
  } catch (error) {
    console.error("Error deleting agenda:", error);
    throw error; 
  }
};
