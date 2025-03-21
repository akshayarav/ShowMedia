import React, { useState, useContext } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import AuthContext from './AuthContext';
const apiUrl = process.env.REACT_APP_API_URL;

function RegisterModal({ closeModal }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [pass, setPass] = useState('');
    const [passConfirm, setPassConfirm] = useState('');
    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { register } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
        } else if (passConfirm !== pass) {
            setError("Passwords don't match")
        }
        else if (email.length === 0) { setError("Please enter a valid email") }
        else if (username.length === 0) { setError("Please enter a valid username") }
        else if (pass.length === 0) { setError("Please enter a valid password") }
        else {
            const result = await register(email, username, pass, first, last);
            if (result.success) {
                setSuccess('Account created successfully!');
                // Optionally, close modal and refresh page
                setTimeout(() => {
                    closeModal();
                    window.location.reload();
                }, 1000);
            } else {
                setError(result.message);
            }
        }

    };

    return (
        <Modal show={true} onHide={closeModal} centered className="modal fade bg-glass">
            <div className="rounded-4 shadow-sm p-4 border-0 bg-brown-gradient-color">
            <div className="modal-header border-0 p-1 mb-4">
                    <h6 className="modal-title fw-bold text-body fs-6">Register</h6>
                    <a href="#" className="text-muted text-decoration-none material-icons ms-2 md-" onClick={closeModal}>close</a>
                </div>
                <div className="modal-body p-0">
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
                                        <h6 className="fw-bold mx-1 mb-2 text-white">Email</h6>
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
                                        <h6 className="fw-bold mx-1 mb-2 text-white">Username</h6>
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
                                        <h6 className="fw-bold mx-1 mb-2 text-white">Name</h6>
                                        <div className="row mx-0 mb-3">
                                            <div className="col-9 p-1">
                                                <div className="form-floating d-flex align-items-end">
                                                    <input
                                                        type="text"
                                                        className="form-control rounded-5"
                                                        id="floatingFirst"
                                                        value={first}
                                                        onChange={(e) => setFirst(e.target.value)}
                                                        placeholder="Enter First Name"
                                                    />
                                                    <label htmlFor="floatingFirst">First Name</label>
                                                </div>
                                            </div>
                                            <div className="col-9 p-1">
                                                <div className="form-floating d-flex align-items-end">
                                                    <input
                                                        type="text"
                                                        className="form-control rounded-5"
                                                        id="floatingLast"
                                                        value={last}
                                                        onChange={(e) => setLast(e.target.value)}
                                                        placeholder="Enter Last Name"
                                                    />
                                                    <label htmlFor="floatingLast">Last Name</label>
                                                </div>
                                            </div>
                                        </div>
                                        <h6 className="fw-bold mx-1 mb-2 text-white">Password</h6>
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
                                        <h6 className="fw-bold mx-1 mb-2 text-white">Confirm Password</h6>
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
                </div>
            </div>
        </Modal>
    );
}

export default RegisterModal