import React from 'react';
import { useAuthGuard } from './authGuard'; // Import the hook
import Header from '../components/Header'; // Adjust the path as necessary
import Footer from '../components/Footer'; // Adjust the path as necessary

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useAuthGuard(); // Check token validity for protected routes

  return (
    <>
      <Header /> {/* Include Header here */}
      <div>{children}</div> {/* Protected content */}
      <Footer /> {/* Include Footer here */}
    </>
  );
};

export default ProtectedRoute;
