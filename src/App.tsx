import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Product from './components/pages/Product';
import Login from './components/pages/Login';
import ProtectedRoute from './utils/ProtectedRoute';
import { useSelector } from 'react-redux';
import { RootState } from './store';

const App: React.FC = () => {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    // If token exists, redirect to /product page
    if (token) {
      navigate('/product');
    }
  }, [token, navigate]);

  return (
      <div className="App">
        <div className="content">
          <Routes>
            {/* If logged in, prevent access to login route */}
            <Route path="/login" element={!token ? <Login /> : <></>} />
            <Route path="/" element={!token ? <Login /> : <></>} />
            <Route
              path="/product"
              element={
                <ProtectedRoute>
                  <Product />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    );
};

export default App;
