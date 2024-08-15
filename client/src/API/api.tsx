import axios from 'axios';



const api = axios.create({
  baseURL:  import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Add a request interceptor to strip "/api" from the URL
api.interceptors.request.use(
    (config) => {
      // Modify the request URL
      if (config.url!.startsWith('/api')) {
        config.url = config.url!.replace('/api', '');
      }
      return config;
    },
    (error) => {
      // Handle the error
      return Promise.reject(error);
    }
  );

export default api;
