import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000', // 🔥 Must match backend URL
  withCredentials: true, // 👈 MUST BE TRUE for session cookies
});

export default apiClient;