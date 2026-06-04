import axios from 'axios';

const API_BASE = 'https://cdmx-air-quality-api-production.up.railway.app';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

export const getMeasurements = (params) => api.get('/measurements/', { params });
export const getStatsSummary = () => api.get('/stats/summary');
export const getAlerts = () => api.get('/stats/alerts');
export const getStatsByZone = () => api.get('/stats/by-zone');
export const createMeasurement = (data) => api.post('/measurements/', data);

export default api;
