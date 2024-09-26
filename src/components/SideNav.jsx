import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importera Bootstrap CSS

const NavigationSidebar = ({ authToken, setAuthToken }) => { // Uppdaterat prop-namn
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Log token value to assist with debugging
  useEffect(() => {
    console.log('Current token:', authToken);
  }, [authToken]);

  const handleSignOut = () => {
    console.log('Signing out');
    setAuthToken(''); // Uppdaterat till setAuthToken
    localStorage.removeItem('token'); // Uppdaterat till "token"
    navigate('/login'); // Navigera till login-sidan
  };

  const toggleMenu = () => {
    setMenuOpen(prevState => !prevState);
  };

  return (
    <div className="position-relative">
      {/* Sign out button positioned at the top right */}
      {authToken && (
        <button
          onClick={handleSignOut}
          className="btn btn-danger position-fixed top-0 end-0 m-3"
          style={{ zIndex: 1050 }} // Ensure it's above other content
        >
          Sign Out
        </button>
      )}

      {/* Hamburger menu for toggling sidebar */}
      <button
        className="btn btn-secondary position-fixed top-0 start-0 m-3"
        onClick={toggleMenu}
      >
        {menuOpen ? (
          <svg className="bi bi-x-lg" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2.5 2.5a.75.75 0 0 1 1.06-1.06L8 6.44l4.44-4.44A.75.75 0 0 1 13.5 2.5L8 7.06 3.56 2.5z"/>
          </svg>
        ) : (
          <svg className="bi bi-list" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2 3.5A.5.5 0 0 1 2.5 3h11a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 3.5zM2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 8zm0 4.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 12.5z"/>
          </svg>
        )}
      </button>

      {/* Sidebar navigation */}
      <div
        className={`offcanvas offcanvas-start ${menuOpen ? 'show' : ''}`}
        style={{ zIndex: 1045 }} // Bootstrap uses z-index 1045 for offcanvas
        tabIndex="-1"
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
      >
        <div className="offcanvas-header">
          <h5 id="offcanvasNavbarLabel">Menu</h5>
          <button
            type="button"
            className="btn-close"
            onClick={toggleMenu}
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="navbar-nav">
            {!authToken ? (
              <>
                <li className="nav-item">
                  <Link to="/" className="nav-link">Registrera</Link>
                </li>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Logga in</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/chat" className="nav-link">Chat</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavigationSidebar;
