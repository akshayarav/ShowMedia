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
      <div class="p-2 bg-light offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample">
          <div class="sidebar-nav mb-3">
            <div class="pb-4">
                <a href="index.html" class="text-decoration-none">
                <img src="logo.png" class="img-fluid logo" alt="brand-logo"/>
                </a>
            </div>
            <ul class="navbar-nav justify-content-end flex-grow-1">
                <li class="nav-item">
                  <a href="index.html" class="nav-link"><span class="material-icons me-3">house</span> <span>Feed</span></a>
                </li>
                <li class="nav-item">
                  <a href="profile.html" class="nav-link active"><span class="material-icons me-3">account_circle</span> <span>Profile</span></a>
                </li>
                <li class="nav-item">
                  <a href="explore.html" class="nav-link"><span class="material-icons me-3">explore</span> <span>Explore</span></a>
                </li>
                <li class="nav-item">
                  <a href="#" class="nav-link" data-bs-toggle="modal" data-bs-target="#languageModal"><span class="material-icons me-3">translate</span> <span>Language</span></a>
                </li>
                <li class="nav-item">
                  <a href="index.html" class="nav-link"><span class="material-icons me-3">logout</span> <span>Logout</span></a>
                </li>
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <span class="material-icons me-3">web</span> Pages
                  </a>
                  <ul class="dropdown-menu px-2 py-1 mb-2">
                      <li><a class="dropdown-item rounded-3 px-2 py-1 my-1" href="contact.html">Contact</a></li>
                      <li><a class="dropdown-item rounded-3 px-2 py-1 my-1" href="faq.html">FAQ</a></li>
                      <li><a class="dropdown-item rounded-3 px-2 py-1 my-1" href="404.html">404 Error</a></li>
                      <li><a class="dropdown-item rounded-3 px-2 py-1 my-1" href="edit-profile.html">Edit Profile</a></li>
                  </ul>
                </li>
                <li class="nav-item">
                  <a href="tags.html" class="nav-link"><span class="material-icons me-3">local_fire_department</span> <span>Trending</span></a>
                </li>
            </ul>
          </div>
          <a href="#" class="btn btn-primary w-100 text-decoration-none rounded-4 py-3 fw-bold text-uppercase m-0" data-bs-toggle="modal" data-bs-target="#signModal">Sign In +</a>
      </div>
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
