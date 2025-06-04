import axios from 'axios';

const api = axios.create({
  baseURL: 'https://group2.sustainability.it.ntnu.no/api',
  withCredentials: true,
});

export default api;
