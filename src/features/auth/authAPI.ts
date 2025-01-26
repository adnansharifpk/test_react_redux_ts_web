// loginApi.ts
import api from '../../utils/apiInterceptor'; // Import the shared API instance

export const loginApi = async (credentials: { email: string; password: string }) => {
  const { email, password } = credentials;
  const response = await api.post('/api/login/', {
    username: email,  // Map email to username here
    password: password,
  });
  return response.data;
};

export const logoutApi = async (refresh: string) => {
  try {
    await api.post('/api/logout/', { refresh }); // Pass refresh token as data
  } catch (error) {
    console.error('Logout API Error:', error);
    throw error;
  }
};