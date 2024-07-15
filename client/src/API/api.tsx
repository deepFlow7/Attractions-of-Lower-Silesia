import axios from 'axios';

const api = axios.create({
  baseURL:  process.env.API_URL || "https://boxwood-builder-429215-k7.ue.r.appspot.com", //Here change to localhost:8080 if needed
});

// Add a request interceptor to strip "/api" from the URL
api.interceptors.request.use(
    (config) => {
      // Modify the request URL
      if (config.url.startsWith('/api')) {
        config.url = config.url.replace('/api', '');
      }
      return config;
    },
    (error) => {
      // Handle the error
      return Promise.reject(error);
    }
  );

export default api;
