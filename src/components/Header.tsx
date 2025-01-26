import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { logout } from '../features/auth/authSlice';
import { useState } from 'react';

const Header = () => {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setShowMenu(false); // Close the menu on logout
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header className="header">
      <div className="container-fluid">
        <div className="row">
          {/* Left Header Title */}
          <div className="col-8">
            <h1>Python/JavaScript Full-stack Test Task</h1>
          </div>

          {/* Right Side for Email and Dropdown Menu */}
          <div className="col-4 d-flex flex-column align-items-end">
            {user ? (
              <div className="dropdown">
                {/* Email with Down Arrow to Show Menu */}
                <span 
                  className="d-block cursor-pointer" 
                  onClick={toggleMenu}
                  aria-expanded={showMenu ? 'true' : 'false'}
                  style={{ cursor: 'pointer' }} // Add this line to change cursor to hand
                >
                  {user.email} 
                </span>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="dropdown-menu dropdown-menu-end show">
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <span>Please log in</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
