import axios from 'axios';
// export const app_url = 'http://localhost:5173/';
// export const base_url = 'http://127.0.0.1:8000/api';
export const nb_key = '908d3c157aae49d898017a167c5b0d0b';
export const app_url = 'http://geniusship.ai/';
export const base_url = 'https://api.geniusship.ai/api';
const baseClient = axios.create({
  baseURL: base_url,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 50000,
});

// Optional: You can add interceptors for request and response handling
baseClient.interceptors.request.use(
  (config) => {
    // Add any request interceptors here
    // For example, adding an authorization token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

baseClient.interceptors.response.use(
  (response) => {
    // Add any response interceptors here
    return response;
  },
  (error) => {
    // Handle errors
    return Promise.reject(error);
  }
);

export default baseClient;
