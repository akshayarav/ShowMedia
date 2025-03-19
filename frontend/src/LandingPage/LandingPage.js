
import { useState, useContext } from "react";
import SignModal from "../Auth/SignModal";
import RegisterModal from "../Auth/RegisterModal";
import AuthContext from "../Auth/AuthContext";

function LandingPage() {
    const [showSignInModal, setShowSignInModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const toggleSignInModal = () => setShowSignInModal(!showSignInModal);
    const toggleRegisterModal = () => setShowRegisterModal(!showRegisterModal);
    const { initiateGoogleSignIn } = useContext(AuthContext);

    const handleGoogleSignIn = () => {
    initiateGoogleSignIn();
    };

    return (
        <body className="bg-light" style = {{height: "100vh"}}>
            <div className="py-4">
                <div className="container">
                    <div className="row position-relative">
                        <div className="landing-container-logo image-container col-xl-6 col-lg-6 col-sm-12 col-md-6">
                            <img src={'./logo.png'} />
                        </div>
                        <div className="landing-container col-xl-6 col-lg-6 col-sm-12 col-md-6">
                            <div>

                                <h2 className="fw-bold text-black mb-1">Track. Share. Explore.</h2>
                                <p className="lead fw-normal text-muted mb-0">Join us:</p>
                                <br></br>
                                
                                <button
                                    className="btn btn-primary btn-icon w-100 text-decoration-none rounded-4 py-3 fw-bold text-uppercase m-0"
                                onClick={toggleSignInModal}
                                >
                                    <span>Sign In</span> <span className="material-icons">open_in_new</span>
                                </button>

                                {showSignInModal && <SignModal closeModal={toggleSignInModal} />}

                                <button
                                    className="btn btn-primary btn-icon w-100 text-decoration-none rounded-4 py-3 fw-bold text-uppercase m-0 button-top-padding"
                                onClick={toggleRegisterModal}
                                >
                                    <span>Register</span> <span className="material-icons">open_in_new</span>
                                </button>
                                {showRegisterModal && <RegisterModal closeModal={toggleRegisterModal} />}

                                <div className="my-3 text-center">
                                    <span className="text-muted">OR</span>
                                </div>

                                <button
                                className="btn btn-outline-secondary btn-icon w-100 text-decoration-none rounded-4 py-3 fw-bold m-0"
                                onClick={handleGoogleSignIn}
                                >
                                    <img 
                                        src="https://developers.google.com/identity/images/g-logo.png" 
                                        alt="Google" 
                                        style={{ width: '20px', marginRight: '10px' }} 
                                    />
                                    <span>Continue with Google</span>
                                </button>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </body>
    )
}

export default LandingPage