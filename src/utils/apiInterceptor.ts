import axios from 'axios';

// Create a shared axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Fallback to localhost if not found
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Retrieve the authData object from localStorage
    const authData = localStorage.getItem('What.AG.Test.authData');
    if (authData) {
      const { token } = JSON.parse(authData); // Extract token from the parsed object
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // Attach token to headers
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor (optional, handle unauthorized cases)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const originalRequest = error.config;
      // console.log(status, " " ,data)
      if (originalRequest.url.includes('/login')) {
        return Promise.reject(error); // Skip redirection for login-specific requests
      }
      // Handle 401 Unauthorized
      if (status === 401) {
        console.error('Unauthorized! Logging out...');
        localStorage.removeItem('What.AG.Test.authData'); // Clear auth data if unauthorized
        window.location.href = '/login'; // Replace with your app's login route
      }

      // Handle 500 error with InvalidToken
      if (
        status === 500 &&
        typeof data === 'string' &&
        data.includes('InvalidToken')
      ) {
        console.error('Invalid Token! Logging out...');
        localStorage.removeItem('What.AG.Test.authData'); // Clear auth data for invalid token
        window.location.href = '/login'; // Redirect to login page
      }
    }

    return Promise.reject(error);
  }
);


export default api;
