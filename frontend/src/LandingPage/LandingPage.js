import { useState, useContext } from "react";
import SignModal from "../Auth/SignModal";
import RegisterModal from "../Auth/RegisterModal";
import AuthContext from "../Auth/AuthContext";
import { Link } from "react-router-dom";
import "./index.css"; // You'll need to create this CSS file

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
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h1 className="display-4 fw-bold">Track. Share. Explore.</h1>
                            <p className="lead mb-4">Your personal TV show companion that connects you with friends and fellow fans.</p>
                            <div className="hero-buttons">
                                <button
                                    className="btn btn-primary btn-lg rounded-4 me-3"
                                    onClick={toggleSignInModal}
                                >
                                    Sign In
                                </button>
                                <button
                                    className="btn btn-outline-primary btn-lg rounded-4"
                                    onClick={toggleRegisterModal}
                                >
                                    Register
                                </button>
                                <div className="mt-3">
                                    <button
                                        className="btn btn-outline-secondary d-flex align-items-center justify-content-center w-100 rounded-4 py-2"
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
                        <div className="col-lg-6">
                            <img 
                                src="./logo.png" 
                                alt="App Screenshot" 
                                className="img-fluid hero-image" 
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="section-title">Why Choose Our Platform</h2>
                        <p className="section-subtitle">Discover a better way to track and share your TV journey</p>
                    </div>
                    
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <span className="material-icons">playlist_add_check</span>
                                </div>
                                <h3>Track Your Shows</h3>
                                <p>Keep track of what you're watching, what you've finished, and what's next on your list.</p>
                            </div>
                        </div>
                        
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <span className="material-icons">group</span>
                                </div>
                                <h3>Connect With Friends</h3>
                                <p>See what your friends are watching and discover new shows through their recommendations.</p>
                            </div>
                        </div>
                        
                        <div className="col-md-4">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <span className="material-icons">forum</span>
                                </div>
                                <h3>Join The Conversation</h3>
                                <p>Share your thoughts, rate episodes, and discuss with other fans in a friendly community.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="section-title">How It Works</h2>
                        <p className="section-subtitle">Start tracking in just three simple steps</p>
                    </div>
                    
                    <div className="row g-4 align-items-center">
                        <div className="col-md-4 text-center">
                            <div className="step-circle">1</div>
                            <h3>Create Your Account</h3>
                            <p>Sign up and personalize your profile in less than a minute.</p>
                        </div>
                        
                        <div className="col-md-4 text-center">
                            <div className="step-circle">2</div>
                            <h3>Add Your Shows</h3>
                            <p>Search and add shows you're watching or want to watch.</p>
                        </div>
                        
                        <div className="col-md-4 text-center">
                            <div className="step-circle">3</div>
                            <h3>Connect With Friends</h3>
                            <p>Find friends and see what they're watching and recommending.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof Section */}
            <section className="testimonials-section">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="section-title">What Our Users Say</h2>
                        <p className="section-subtitle">Join thousands of satisfied users tracking their favorite shows</p>
                    </div>
                    
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="testimonial-card">
                                <div className="rating">★★★★★</div>
                                <p className="testimonial-text">"I love being able to see what my friends are watching. Found so many great shows I would have missed!"</p>
                                <div className="testimonial-author">- Alex P.</div>
                            </div>
                        </div>
                        
                        <div className="col-md-4">
                            <div className="testimonial-card">
                                <div className="rating">★★★★★</div>
                                <p className="testimonial-text">"The perfect way to keep track of all the shows I'm watching across different streaming platforms."</p>
                                <div className="testimonial-author">- Jamie S.</div>
                            </div>
                        </div>
                        
                        <div className="col-md-4">
                            <div className="testimonial-card">
                                <div className="rating">★★★★★</div>
                                <p className="testimonial-text">"The community discussions are amazing! Love chatting about episode theories with other fans."</p>
                                <div className="testimonial-author">- Taylor R.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* App Screenshots */}
            <section className="screenshots-section">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="section-title">App Preview</h2>
                        <p className="section-subtitle">See what makes our platform special</p>
                    </div>
                    
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="screenshot-card">
                                <img src="./profile.png" alt="Profile Dashboard" className="img-fluid rounded" />
                                <h4 className="mt-3">Personal Dashboard</h4>
                                <p>Keep track of all your shows in one place</p>
                            </div>
                        </div>
                        
                        <div className="col-md-4">
                            <div className="screenshot-card">
                                <img src="./feed.png" alt="Social Feed" className="img-fluid rounded" />
                                <h4 className="mt-3">Social Feed</h4>
                                <p>See activity from friends and people you follow</p>
                            </div>
                        </div>
                        
                        <div className="col-md-4">
                            <div className="screenshot-card">
                                <img src="./show_info.png" alt="Show Details" className="img-fluid rounded" />
                                <h4 className="mt-3">Detailed Show Pages</h4>
                                <p>Get info, ratings, and discussions for any show</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="section-title">Frequently Asked Questions</h2>
                        <p className="section-subtitle">Get answers to common questions</p>
                    </div>
                    
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="accordion" id="faqAccordion">
                                <div className="accordion-item mb-3 border rounded shadow-sm" style={{ borderColor: '#dee2e6' }}>
                                    <h2 className="accordion-header">
                                        <button 
                                            className="accordion-button fw-bold" 
                                            type="button" 
                                            data-bs-toggle="collapse" 
                                            data-bs-target="#faq1"
                                            style={{ color: 'black', backgroundColor: '#f8f9fa', fontSize: '1.1rem' }}
                                        >
                                            Is this service free to use?
                                        </button>
                                    </h2>
                                    <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body" style={{ color: 'black', fontSize: '1.05rem', lineHeight: '1.6' }}>
                                            Yes, our platform is completely free to use! Create an account and start tracking your shows right away.
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="accordion-item mb-3 border rounded shadow-sm" style={{ borderColor: '#dee2e6' }}>
                                    <h2 className="accordion-header">
                                        <button 
                                            className="accordion-button collapsed fw-bold" 
                                            type="button" 
                                            data-bs-toggle="collapse" 
                                            data-bs-target="#faq2"
                                            style={{ color: 'black', backgroundColor: '#f8f9fa', fontSize: '1.1rem' }}
                                        >
                                            Can I connect with friends from other platforms?
                                        </button>
                                    </h2>
                                    <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body" style={{ color: 'black', fontSize: '1.05rem', lineHeight: '1.6' }}>
                                            You can invite friends via email or search for them by username. We're also working on social media integration!
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="accordion-item mb-3 border rounded shadow-sm" style={{ borderColor: '#dee2e6' }}>
                                    <h2 className="accordion-header">
                                        <button 
                                            className="accordion-button collapsed fw-bold" 
                                            type="button" 
                                            data-bs-toggle="collapse" 
                                            data-bs-target="#faq3"
                                            style={{ color: 'black', backgroundColor: '#f8f9fa', fontSize: '1.1rem' }}
                                        >
                                            Which streaming services do you support?
                                        </button>
                                    </h2>
                                    <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body" style={{ color: 'black', fontSize: '1.05rem', lineHeight: '1.6' }}>
                                            Our database includes shows from all major streaming platforms including Netflix, Hulu, HBO Max, Disney+, Prime Video, and more!
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container text-center">
                    <h2 className="mb-4">Ready to track your favorite shows?</h2>
                    <p className="lead mb-5">Join our community of TV enthusiasts today and never lose track of your shows again!</p>
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <button
                                className="btn btn-primary btn-lg w-100 rounded-4 mb-3"
                                onClick={toggleRegisterModal}
                            >
                                Get Started Now
                            </button>
                            <button
                                className="btn btn-outline-primary btn-lg w-100 rounded-4"
                                onClick={toggleSignInModal}
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 mb-4 mb-lg-0">
                            <img src="./logo.png" alt="Logo" className="footer-logo mb-3" style={{ height: "50px" }} />
                            <p>Your personal TV show companion that keeps you connected with what's trending and what your friends are watching.</p>
                        </div>
                        <div className="col-lg-2 col-md-4 mb-4 mb-md-0">
                            <h5>Platform</h5>
                            <ul className="footer-links">
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">Features</a></li>
                                <li><a href="#">Pricing</a></li>
                            </ul>
                        </div>
                        <div className="col-lg-2 col-md-4 mb-4 mb-md-0">
                            <h5>Support</h5>
                            <ul className="footer-links">
                                <li><a href="#">Help Center</a></li>
                                <li><a href="#">Contact Us</a></li>
                                <li><a href="#">Privacy Policy</a></li>
                            </ul>
                        </div>
                        <div className="col-lg-4 col-md-4">
                            <h5>Stay Updated</h5>
                            <p>Subscribe to our newsletter for updates and new features.</p>
                            <div className="input-group mb-3">
                                <input type="email" className="form-control" placeholder="Your email" />
                                <button className="btn btn-primary" type="button">Subscribe</button>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center text-md-start">
                            <p className="mb-0">© 2023 ShowMedia. All rights reserved.</p>
                        </div>
                        <div className="col-md-6 text-center text-md-end">
                            <div className="social-links">
                                <a href="#"><i className="bi bi-facebook"></i></a>
                                <a href="#"><i className="bi bi-twitter"></i></a>
                                <a href="#"><i className="bi bi-instagram"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Modals */}
            {showSignInModal && <SignModal closeModal={toggleSignInModal} />}
            {showRegisterModal && <RegisterModal closeModal={toggleRegisterModal} />}
        </div>
    );
}

export default LandingPage;