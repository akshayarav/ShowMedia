import React, { useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
const apiUrl = process.env.REACT_APP_API_URL;

function SignModal({ closeModal }) {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 
        setSuccess(''); 
        try {
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: pass,
                }),
            });

            const data = await response.json();

            if (response.status === 200) {
                setSuccess('Successfully Logged In!'); // Set success message
                setTimeout(() => {
                    closeModal();
                }, 2000);
            } else {
                setError(data.error); 
            }
        } catch (error) {
            setError('There was an error submitting the form.');
            console.error('There was an error submitting the form', error);
        }
    };

    return (
        <Modal show={true} onHide={closeModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Sign In</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <div className="modal-content rounded-4 p-4 border-0">
                    <div className="modal-header border-0 p-1">
                        <h6 className="modal-title fw-bold text-body fs-6" id="exampleModalLabel">Login to Account</h6>
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
                                    <div className="p-1">
                                        <button type="submit" className="btn btn-primary w-100 text-decoration-none rounded-5 py-3 fw-bold text-uppercase m-0">Sign In</button>
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

export default SignModal;