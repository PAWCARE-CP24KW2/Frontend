import axios from "axios";

const baseUrl = "http://192.168.1.139:8080";

// const baseUrl = "http://capstone24.sit.kmutt.ac.th:8080/kw2";

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
