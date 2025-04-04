
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

function Sidebar({ isOffcanvasOpen, toggleOffcanvas }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const toggleSignInModal = () => setShowSignInModal(!showSignInModal);
  const toggleRegisterModal = () => setShowRegisterModal(!showRegisterModal);
  const offcanvasRef = useRef();

  const { isAuthenticated, logout } = useContext(AuthContext);

  const currentUser = localStorage.getItem('username');

  const offcanvasClasses = `p-2 bg-brown-gradient offcanvas offcanvas-start ${isOffcanvasOpen ? 'show' : ''}`;

  const handleLogOut = () => {
    logout();
    navigate('/feed');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOffcanvasOpen && offcanvasRef.current && !offcanvasRef.current.contains(event.target)) {
        toggleOffcanvas();
        console.log("PRESSED");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOffcanvasOpen, toggleOffcanvas]);

  const authButtons = (
    <button
      className="btn btn-primary w-100 text-decoration-none rounded-4 py-3 fw-bold text-uppercase m-0 button-top-padding"
      onClick={handleLogOut}
    >
      Log Out
    </button>
  )




  return (
    <aside className="col col-xl-3 order-xl-1 col-lg-6 order-lg-1 col-md-6 col-sm-6 col-12">
      <div className={offcanvasClasses} tabIndex="-1" id="offcanvasExample" ref={offcanvasRef}>
        <div className="sidebar-nav mb-3">
          <div className="pb-4 mb-4">
            <Link to="/feed" className="text-decoration-none">
              <img src="/logo.png" className="img-fluid logo" alt="brand-logo" />
            </Link>
          </div>
          <ul className="navbar-nav justify-content-end flex-grow-1">
            <li className="nav-item">
              <Link to="/feed" className={`nav-link ${location.pathname === '/feed' ? 'active' : ''}`}> <span className="material-icons me-3">house</span> <span>Feed</span></Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link to={`/profile/${currentUser}`} className={`nav-link ${location.pathname === `/profile/${currentUser}` ? 'active' : ''}`}>
                  <span className="material-icons me-3">account_circle</span> <span>Profile</span>
                </Link>
              </li>
            )}
            {isAuthenticated && (
              <li className="nav-item">
                <Link to={`/notifications/${currentUser}`} className={`nav-link ${location.pathname === `/notifications/${currentUser}` ? 'active' : ''}`}>
                  <span className="material-icons me-3">notifications</span> <span>Notifications</span>
                </Link>
              </li>
            )}
            {isAuthenticated && (
              <li className="nav-item">
                <Link to={`/messages/${currentUser}`} className={`nav-link ${location.pathname === `/messages/${currentUser}` ? 'active' : ''}`}>
                  <span className="material-icons me-3">mail</span> <span>Messages</span>
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link to="/shows" className={`nav-link ${location.pathname === '/shows' ? 'active' : ''}`}> <span className="material-icons me-3">explore</span> <span>Shows</span></Link>
            </li>
          </ul>
        </div>
        {authButtons}
      </div>
      <div className="ps-0 m-none fix-sidebar">
        <div className="sidebar-nav mb-3">
          <div className="pb-4 mb-4">
            <Link to="/feed" className="text-decoration-none">
              <img src="/logo.png" className="img-fluid logo" alt="brand-logo" />
            </Link>
          </div>
          <ul className="navbar-nav justify-content-end flex-grow-1">
            <li className="nav-item">
              <Link to="/feed" className={`nav-link ${location.pathname === '/feed' ? 'active' : ''}`}> <span className="material-icons me-3">house</span> <span>Feed</span></Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link to={`/profile/${currentUser}`} className={`nav-link ${location.pathname === `/profile/${currentUser}` ? 'active' : ''}`}>
                  <span className="material-icons me-3">account_circle</span> <span>Profile</span>
                </Link>
              </li>
            )}
            {isAuthenticated && (
              <li className="nav-item">
                <Link to={`/notifications/${currentUser}`} className={`nav-link ${location.pathname === `/notifications/${currentUser}` ? 'active' : ''}`}>
                  <span className="material-icons me-3">notifications</span> <span>Notifications</span>
                </Link>
              </li>
            )}
            {isAuthenticated && (
              <li className="nav-item">
                <Link to={`/messages/${currentUser}`} className={`nav-link ${location.pathname === `/messages/${currentUser}` ? 'active' : ''}`}>
                  <span className="material-icons me-3">mail</span> <span>Messages</span>
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link to="/shows" className={`nav-link ${location.pathname === '/shows' ? 'active' : ''}`}> <span className="material-icons me-3">explore</span> <span>Shows</span></Link>
            </li>
          </ul>
        </div>
        {authButtons}
      </div>
    </aside>
  );
}

export default Sidebar;