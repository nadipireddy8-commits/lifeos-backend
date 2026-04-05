import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// CORRECT live backend URL
const API_URL = 'https://lifeos-backend-017u.onrender.com/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (email, password) => api.post('/auth/register', { email, password });
export const logAction = (data) => api.post('/actions', data);
export const getActions = () => api.get('/actions');
export const getInsights = () => api.get('/insights');
export const askAssistant = (message) => api.post('/assistant/chat', { message });
export const getGoals = () => api.get('/goals');
export const createGoal = (goal, deadline) => api.post('/goals', { goal, deadline });
export const completeGoal = (id) => api.patch(`/goals/${id}/complete`);
export const analyzeMessage = (text) => api.post('/actions/analyze-message', { text });