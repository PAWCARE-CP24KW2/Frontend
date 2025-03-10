import axios from 'axios';
import { BASE_URL } from '@env';

export const getCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/agendas/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};