import { Modal, Alert } from 'react-bootstrap';
import React, { useState } from 'react';
import axios from 'axios';


function EditModal({ closeModal }) {
    const user = JSON.parse(localStorage.getItem('user'));

    const [tempBio, setTempBio] = useState(user.bio)
    const [first, setFirst] = useState(user.first)
    console.log(user)
    const [last, setLast] = useState(user.last)
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const username = localStorage.getItem('username')

    const handleSubmit = (e) => {
        e.preventDefault();
        const apiUrl = process.env.REACT_APP_API_URL

        axios.post(`${apiUrl}/edit/${username}`, { bio: tempBio, first: first, last: last })
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
        <Modal show={true} onHide={closeModal} centered className="modal fade bg-glass">
            <div className="rounded-4 shadow-sm p-4 border-0 bg-brown-gradient-color">
                <div className="modal-header border-0 p-1 mb-4">
                    <h6 className="modal-title fw-bold text-body fs-6">Edit Profile</h6>
                    <a href="#" className="text-muted text-decoration-none material-icons ms-2 md-" onClick={closeModal}>close</a>
                </div>
                <div className="modal-body p-0">
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <div className="modal-content rounded-4 p-4 border-0">
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body p-0">
                                <div className="row py-3 gy-3 m-0">
                                    <div className="mt-0 login-register" id="number">
                                        <h6 className="fw-bold mx-1 mb-2 text-white">Add Bio</h6>
                                        <div className="row mx-0 mb-3">
                                            <div className="col-9 p-1">
                                                <div className="form-floating d-flex align-items-end">
                                                    <input
                                                        type="text"
                                                        className="form-control rounded-5"
                                                        id="floatingBio"
                                                        value={tempBio}
                                                        onChange={(e) => setTempBio(e.target.value)}
                                                        placeholder="Bio"
                                                    />
                                                    <label htmlFor="floatingBio" className="text-muted">Enter Bio</label>
                                                </div>
                                            </div>
                                        </div>
                                        <h6 className="fw-bold mx-1 mb-2 text-white\">Name</h6>
                                        <div className="row mx-0 mb-3">
                                            <div className="col-9 p-1">
                                                <div className="form-floating d-flex align-items-end">
                                                    <input
                                                        type="text"
                                                        className="form-control rounded-5"
                                                        id="floatingEditFirst"
                                                        value={first}
                                                        onChange={(e) => setFirst(e.target.value)}
                                                        placeholder="First Name"
                                                    />
                                                    <label htmlFor="floatingEditFirst" className="text-muted">First Name</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mx-0 mb-3">
                                            <div className="col-9 p-1">
                                                <div className="form-floating d-flex align-items-end">
                                                    <input
                                                        type="text"
                                                        className="form-control rounded-5"
                                                        id="floatingEditLast"
                                                        value={last}
                                                        onChange={(e) => setLast(e.target.value)}
                                                        placeholder="Last Name"
                                                    />
                                                    <label htmlFor="floatingEditLast" className="text-muted">Last Name</label>
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
                </div>
            </div>
        </Modal>
    )
}
export default EditModal