import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../features/auth/authSlice';
import { AppDispatch } from '../../store';
import { toast, ToastContainer } from 'react-toastify';
import './styles/Login.css';

const LoginComponent = () => {
  const dispatch: AppDispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State to track loading status

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the process starts
    try {
      await dispatch(login({ email, password })).unwrap();
    } catch (error) {
      toast.error(error as string); // Display the error in a toaster
    } finally {
      setLoading(false); // Set loading to false when the process ends
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
              disabled={loading} // Disable input when loading
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              disabled={loading} // Disable input when loading
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading} // Disable button when loading
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>

      {/* Toast container to display toasts */}
      <ToastContainer
        autoClose={5000}
        newestOnTop
        closeOnClick
        closeButton={false}
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default LoginComponent;
