import { useState } from "react";
import ShowInfo from "./ShowInfo/ShowInfo";
import Sidebar from "../Sidebar/sidebar";
import { useParams, useNavigate } from "react-router-dom";

function ShowInfoMain() {
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="bg-brown-gradient">
            <div className="py-4">
                <div className="container">
                    <div className="row justify-content-center">
                        <main className="col col-xl-9 order-lg-2 col-lg-12 col-md-12 col-sm-12 border-start">
                            <button
                                className="material-icons text-decoration-none mb-4 me-5"
                                onClick={() => navigate(-1)}
                                style={{ 
                                    color: 'rgba(255, 126, 0, 0.8)', 
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer'
                                }}
                            >
                                arrow_back
                            </button>
                            
                            {/* ShowInfo component now contains the tabs */}
                            <ShowInfo />
                        </main>
                        <Sidebar isOffcanvasOpen={isOffcanvasOpen} toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShowInfoMain;