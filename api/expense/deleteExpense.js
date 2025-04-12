import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';

export const deleteExpense = async (expenseId) => {
  try {
    const token = await AsyncStorage.getItem('userToken'); // Retrieve the token
    if (!token) {
      throw new Error('No token found');
    }

    const response = await axios.delete(`${BASE_URL}/api/expense/deleteExpenses/${expenseId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request headers
      },
    });

    return response.data; // Return the response data
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
    throw error; // Rethrow the error for further handling
  }
};