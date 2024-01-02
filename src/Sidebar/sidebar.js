import React, { useState } from 'react';
import './sidebar.css'; 
import SignModal from './SignModal';

function Sidebar() {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  return (
    <aside className="col col-xl-3 order-xl-1 col-lg-6 order-lg-2 col-md-6 col-sm-6 col-12">
    <head>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
    </head>
      <div className="ps-0 m-none fix-sidebar">
        <div className="sidebar-nav mb-3">
          <div class="pb-4 mb-4">
              <a href="index.html" class="text-decoration-none">
              <img src="logo.png" class="img-fluid logo" alt="brand-logo"/>
              </a>
          </div>
          <ul className="navbar-nav justify-content-end flex-grow-1">
            <li className="nav-item">
              <a href="index.html" className="nav-link"> <span class="material-icons me-3">house</span> <span>Feed</span></a>
            </li>
            <li className="nav-item">
              <a href="profile.html" className="nav-link"> <span class="material-icons me-3">account_circle</span> <span>Profile</span></a>
            </li>
            <li className="nav-item">
              <a href="profile.html" className="nav-link"> <span class="material-icons me-3">explore</span> <span>Shows</span></a>
            </li>
          </ul>
        </div>
        <button
          className="btn btn-primary w-100 text-decoration-none rounded-4 py-3 fw-bold text-uppercase m-0"
          onClick={toggleModal}
        >Sign In +</button>

        {showModal && <SignModal closeModal={toggleModal} />}
      </div>
    </aside>
  );
}

export default Sidebar;
