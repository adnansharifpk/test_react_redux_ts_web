// main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';  // Import the Provider component
import { store } from './store';  // Import the Redux store
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router } from 'react-router-dom';

// Wrapping the App component with the Provider to give it access to Redux store
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>  {/* Wrap your app in Provider */}
      <Router>
        <App />
      </Router>
    </Provider>
  </StrictMode>
);
