import React, { useState, useContext } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import AuthContext from '../AuthContext';
const apiUrl = process.env.REACT_APP_API_URL;

function RegisterModal({ closeModal }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [pass, setPass] = useState('');
    const [passConfirm, setPassConfirm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { isAuthenticated, login, logout } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        console.log(`${apiUrl}/register`)
        e.preventDefault();
        setError('');
        setSuccess('');
        if (passConfirm !== pass) {
            setError("Passwords don't match")
        }
        else if (email.length === 0) {setError("Please enter a valid email")}
        else if (username.length === 0) {setError("Please enter a valid username")}
        else if (pass.length === 0) {setError("Please enter a valid password")}
        else {
            try {
                const response = await fetch(`${apiUrl}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        username: username,
                        password: pass,
                    }),
                });

                const data = await response.json();

                if (response.status === 201) {
                    setSuccess('Account created successfully!');
                    setTimeout(() => {
                        login(data.token, data.userId); 
                        closeModal()
                    }, 1000);
                } else {
                    // Handle errors
                    setError(data.error || 'Failed to create account.'); // Set error message
                }
            } catch (error) {
                setError('There was an error submitting the form.');
                console.error('There was an error submitting the form', error);
            }
        }

    };

    return (
        <Modal show={true} onHide={closeModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Register</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <div className="modal-content rounded-4 p-4 border-0">
                    <div className="modal-header border-0 p-1">
                        <h6 className="modal-title fw-bold text-body fs-6" id="exampleModalLabel">Make Account</h6>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-0">
                            <div className="row py-3 gy-3 m-0">
                                <div className="mt-5 login-register" id="number">
                                    <h6 className="fw-bold mx-1 mb-2 text-dark">Email</h6>
                                    <div className="row mx-0 mb-3">
                                        <div className="col-9 p-1">
                                            <div className="form-floating d-flex align-items-end">
                                                <input
                                                    type="text"
                                                    className="form-control rounded-5"
                                                    id="floatingEmail"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="Enter Email"
                                                />
                                                <label htmlFor="floatingEmail">Enter Email</label>
                                            </div>
                                        </div>
                                    </div>
                                    <h6 className="fw-bold mx-1 mb-2 text-dark">Username</h6>
                                    <div className="row mx-0 mb-3">
                                        <div className="col-9 p-1">
                                            <div className="form-floating d-flex align-items-end">
                                                <input
                                                    type="text"
                                                    className="form-control rounded-5"
                                                    id="floatingUser"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    placeholder="Enter Username"
                                                />
                                                <label htmlFor="floatingUser">Enter Username</label>
                                            </div>
                                        </div>
                                    </div>
                                    <h6 className="fw-bold mx-1 mb-2 text-dark">Password</h6>
                                    <div className="row mx-0 mb-3">
                                        <div className="col-9 p-1">
                                            <div className="form-floating d-flex align-items-end">
                                                <input
                                                    type="password"
                                                    className="form-control rounded-5"
                                                    id="floatingPass"
                                                    value={pass}
                                                    onChange={(e) => setPass(e.target.value)}
                                                    placeholder="Enter Password"
                                                />
                                                <label htmlFor="floatingPass">Enter Password</label>
                                            </div>
                                        </div>
                                    </div>
                                    <h6 className="fw-bold mx-1 mb-2 text-dark">Confirm Password</h6>
                                    <div className="row mx-0 mb-3">
                                        <div className="col-9 p-1">
                                            <div className="form-floating d-flex align-items-end">
                                                <input
                                                    type="password"
                                                    className="form-control rounded-5"
                                                    id="floatingPass"
                                                    value={passConfirm}
                                                    onChange={(e) => setPassConfirm(e.target.value)}
                                                    placeholder="Enter Password"
                                                />
                                                <label htmlFor="floatingPass"></label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-1">
                                        <button type="submit" className="btn btn-primary w-100 text-decoration-none rounded-5 py-3 fw-bold text-uppercase m-0">Make Account</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default RegisterModal