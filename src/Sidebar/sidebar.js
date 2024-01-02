import React, { useState } from 'react';
import './sidebar.css'; 
import SignModal from './SignModal';

function Sidebar() {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  return (
    <aside className="col col-xl-3 order-xl-1 col-lg-6 order-lg-2 col-md-6 col-sm-6 col-12">
      <div className="ps-0 m-none fix-sidebar">
        <div className="sidebar-nav mb-3">
          <ul className="navbar-nav justify-content-end flex-grow-1">
            <li className="nav-item">
              <a href="index.html" className="nav-link"> <span>Feed</span></a>
            </li>
            <li className="nav-item">
              <a href="profile.html" className="nav-link"> <span>Profile</span></a>
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
