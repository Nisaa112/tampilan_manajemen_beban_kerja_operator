import axios from 'axios';

// Buat instance axios dengan URL dasar Laravel Anda
const api = axios.create({
  baseURL: 'https://cod-active-bluejay.ngrok-free.app/api', // Ganti dengan URL Ngrok/Localhost Laravel Anda
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

// Interceptor: Otomatis menyisipkan Token JWT ke setiap request jika token ada di localStorage
api.interceptors.request.use(
  (config) => {
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

export default api;