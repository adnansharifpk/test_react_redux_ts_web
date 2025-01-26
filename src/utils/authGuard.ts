import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { RootState, AppDispatch } from '../store'; // Import the correct types
import { logout } from '../features/auth/authSlice';

export const useAuthGuard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>(); // Ensure you use the correct typed dispatch
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    // If token is not present, navigate to login
    if (!token) {
      navigate('/login'); // Redirect to login if the token is missing
      return;
    }

    const { exp }: { exp: number } = jwtDecode(token); // Decode token to check expiry
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    // If the token is expired, log out the user
    if (exp < currentTime) {
      dispatch(logout()) // Dispatch the logout action
        .unwrap()
        .then(() => {
          // Do something after successful logout (if needed)
          navigate('/login');
        })
        .catch((error) => {
          // Handle logout error (optional)
          console.error('Logout failed:', error);
          navigate('/login'); // You can also handle failure by redirecting
        });
    }
    
  }, [token, navigate, dispatch]);
};
