import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Sidebar from "../Sidebar/sidebar";

function Profile() {
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

    const toggleOffcanvas = () => {
        setIsOffcanvasOpen(!isOffcanvasOpen);
        console.log(isOffcanvasOpen)
    };

    return (
        <body className="bg-light">
            <div className="web-none d-flex align-items-center px-3 pt-3">
                <a href="index.html" className="text-decoration-none">
                    <img src="img/logo.png" className="img-fluid logo-mobile" alt="brand-logo" />
                </a>
                <button className="ms-auto btn btn-primary ln-0" type="button" onClick={toggleOffcanvas}>
                    <span className="material-icons">menu</span>
                </button>
            </div>
            <Sidebar isOffcanvasOpen={isOffcanvasOpen} toggleOffcanvas={toggleOffcanvas}/>
        </body>
    )
}
export default Profile