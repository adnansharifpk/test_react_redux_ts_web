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
  const [emailValid, setEmailValid] = useState(true); // State to track email validity
  const [submitted, setSubmitted] = useState(false); // To track if form was submitted

  // Simple email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true); // Mark form as submitted

    // Validate email
    if (!emailRegex.test(email)) {
      setEmailValid(false); // Mark email as invalid if it doesn't match the regex
      return; // Don't proceed with the form submission
    }

    setEmailValid(true); // Reset email validity on successful validation
    setLoading(true); // Set loading to true when the process starts
    try {
      await dispatch(login({ email, password })).unwrap();
    } catch (error) {
      toast.error(error as string); // Display the error in a toaster
    } finally {
      setLoading(false); // Set loading to false when the process ends
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailValid(emailRegex.test(value)); // Validate the email format as the user types
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit} noValidate> {/* Disable browser validation */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className={`form-control ${(!emailValid) ? 'is-invalid' : ''}`} // Apply 'is-invalid' class if email is invalid after form submission
              id="email"
              value={email}
              onChange={handleEmailChange}
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
            disabled={loading || !emailValid || email.trim() === ''} // Disable button when loading, email is invalid, or email is empty
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
