import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Product from './components/pages/Product';
import Login from './components/pages/Login';
import ProtectedRoute from './utils/ProtectedRoute';
import { useSelector } from 'react-redux';
import { RootState } from './store';

const App: React.FC = () => {
  // const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);

  return (
      <div className="App">
        <div className="content">
          <Routes>
            {/* If logged in, prevent access to login route */}
            <Route
            path="/"
            element={
              !token ? (
                <Login />
              ) : (
                <ProtectedRoute>
                  <Product />
                </ProtectedRoute>
              )
            }
          />
          {/* Catch-all for any other path and redirect to / */}
          <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    );
};

export default App;
