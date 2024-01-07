import { Modal, Button, Alert } from 'react-bootstrap';
import React, { useState, useContext } from 'react';
import axios from 'axios';


function EditModal({ closeModal }) {
    const [tempBio, setTempBio] = useState('')
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const username = localStorage.getItem('username')

    const handleSubmit = (e) => {
        e.preventDefault();
        const apiUrl = process.env.REACT_APP_API_URL

        axios.post(`${apiUrl}/edit/${username}`, { bio: tempBio })
            .then(response => {
                setSuccess('Bio updated successfully!');
                setTimeout(() => {
                    closeModal()
                    window.location.reload();
                }, 1000);
            })
            .catch(error => {
                console.error('Error updating bio:', error);
                setError(error.response?.data || 'Error updating bio');
            });
    }

    return (
        <Modal show={true} onHide={closeModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <div className="modal-content rounded-4 p-4 border-0">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-0">
                            <div className="row py-3 gy-3 m-0">
                                <div className="mt-5 login-register" id="number">
                                    <h6 className="fw-bold mx-1 mb-2 text-dark">Add Bio</h6>
                                    <div className="row mx-0 mb-3">
                                        <div className="col-9 p-1">
                                            <div className="form-floating d-flex align-items-end">
                                                <input
                                                    type="text"
                                                    className="form-control rounded-5"
                                                    id="floatingBio"
                                                    value={tempBio}
                                                    onChange={(e) => setTempBio(e.target.value)}
                                                    placeholder="Enter Username"
                                                />
                                                <label htmlFor="floatingBio">Enter Bio</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-1">
                                        <button type="submit" className="btn btn-primary w-100 text-decoration-none rounded-5 py-3 fw-bold text-uppercase m-0">Make Changes</button>
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
    )
}
export default EditModal