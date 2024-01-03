import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

function SignModal({ closeModal }) {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <Modal show={true} onHide={closeModal} centered>
            <Modal.Header closeButton>
                <Modal.Title id="exampleModalLabel">Sign In</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div class="modal-content rounded-4 p-4 border-0">
                    <div className="modal-header border-0 p-1">
                        <h6 className="modal-title fw-bold text-body fs-6" id="exampleModalLabel">Make Account</h6>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div class="modal-body p-0">
                            <div class="row py-3 gy-3 m-0">
                                <div class="mt-5 login-register" id="number">
                                    <h6 class="fw-bold mx-1 mb-2 text-dark">Email</h6>
                                    <div class="row mx-0 mb-3">
                                        <div class="col-9 p-1">
                                            <div class="form-floating d-flex align-items-end">
                                                <input
                                                    type="text"
                                                    class="form-control rounded-5"
                                                    id="floatingEmail"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="Enter Email"
                                                />
                                                <label for="floatingEmail">Enter Email</label>
                                            </div>
                                        </div>
                                    </div>
                                    <h6 class="fw-bold mx-1 mb-2 text-dark">Password</h6>
                                    <div class="row mx-0 mb-3">
                                        <div class="col-9 p-1">
                                            <div class="form-floating d-flex align-items-end">
                                                <input
                                                    type="password"
                                                    class="form-control rounded-5"
                                                    id="floatingPass"
                                                    value={pass}
                                                    onChange={(e) => setPass(e.target.value)}
                                                    placeholder="Enter Password"
                                                />
                                                <label for="floatingPass">Enter Password</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="p-1">
                                        <button type="button" class="btn btn-primary w-100 text-decoration-none rounded-5 py-3 fw-bold text-uppercase m-0" data-bs-dismiss="modal">Make Account</button>
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

export default SignModal