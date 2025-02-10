import axios from 'axios';
import { BASE_URL } from '@env'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchAgendas = async () => {
  function parseJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  }

  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('No token found');
    }

    const decodedToken = parseJWT(token);
    const userId = decodedToken.userId;
    const response = await axios.get(`${BASE_URL}/api/agendas/myAgendas`, {
      headers: {
        Authorization: `Bearer ${token}` // Include the token in the request headers
      },
      params: {
        userId: userId
      }
    });
    const agendas = response.data;

    if (!Array.isArray(agendas) || agendas.length === 0) {
      return {}; 
    }

    const transformedAgendas = {};
    agendas.forEach(agenda => {
      const date = agenda.appointment.split('T')[0];
      const time = agenda.appointment.split('T')[1].split(':').slice(0, 2).join(':');
      if (!transformedAgendas[date]) {
        transformedAgendas[date] = [];
      }
      transformedAgendas[date].push({
        id: agenda.agenda_id,
        title: agenda.agenda_title,
        message: agenda.agenda_message,
        status: agenda.status,
        time: time,
      });
    });
    
    return transformedAgendas;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      console.warn('No agendas found. Returning an empty object.');
      return {}; // Handle the 404 error specifically by returning an empty object
    }
    console.error('Error fetching data:', err);
    throw err
  }
}