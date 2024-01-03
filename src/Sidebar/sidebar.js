
import React, { useState, useRef, useEffect} from 'react';
import './sidebar.css';
import SignModal from './SignModal';
import { Link } from 'react-router-dom';

function Sidebar({ isOffcanvasOpen }) {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);
  const offcanvasRef = useRef();


  const offcanvasClasses = `p-2 bg-light offcanvas offcanvas-start ${isOffcanvasOpen ? 'show' : ''}`;
  console.log(offcanvasClasses)




  return (
    <aside className="col col-xl-3 order-xl-1 col-lg-6 order-lg-1 col-md-6 col-sm-6 col-12">
      <div className={offcanvasClasses} tabindex="-1" id="offcanvasExample" ref={offcanvasRef}>
        <div className="sidebar-nav mb-3">
          <div className="pb-4 mb-4">
            <Link to="/feed" className="text-decoration-none">
              <img src="logo.png" className="img-fluid logo" alt="brand-logo" />
            </Link>
          </div>
          <ul className="navbar-nav justify-content-end flex-grow-1">
            <li className="nav-item">
              <Link to="/feed" className="nav-link"> <span className="material-icons me-3">house</span> <span>Feed</span></Link>
            </li>
            <li className="nav-item">
              <Link to="/profile" className="nav-link"> <span className="material-icons me-3">account_circle</span> <span>Profile</span></Link>
            </li>
            <li className="nav-item">
              <Link to="/shows" className="nav-link"> <span className="material-icons me-3">explore</span> <span>Shows</span></Link>
            </li>
          </ul>
        </div>
        <button
          className="btn btn-primary w-100 text-decoration-none rounded-4 py-3 fw-bold text-uppercase m-0"
          onClick={toggleModal}
        >Sign In +</button> {showModal && <SignModal closeModal={toggleModal} />}
      </div>
      <div className="ps-0 m-none fix-sidebar">
        <div className="sidebar-nav mb-3">
          <div className="pb-4 mb-4">
            <Link to="/feed" className="text-decoration-none">
              <img src="logo.png" className="img-fluid logo" alt="brand-logo" />
            </Link>
          </div>
          <ul className="navbar-nav justify-content-end flex-grow-1">
            <li className="nav-item">
              <Link to="/feed" className="nav-link"> <span className="material-icons me-3">house</span> <span>Feed</span></Link>
            </li>
            <li className="nav-item">
              <Link to="/profile" className="nav-link"> <span className="material-icons me-3">account_circle</span> <span>Profile</span></Link>
            </li>
            <li className="nav-item">
              <Link to="/shows" className="nav-link"> <span className="material-icons me-3">explore</span> <span>Shows</span></Link>
            </li>
          </ul>
        </div>
        <button
          className="btn btn-primary w-100 text-decoration-none rounded-4 py-3 fw-bold text-uppercase m-0"
          onClick={toggleModal}
        >Sign In +</button> {showModal && <SignModal closeModal={toggleModal} />}
      </div>
    </aside>
  );
}

export default Sidebar;