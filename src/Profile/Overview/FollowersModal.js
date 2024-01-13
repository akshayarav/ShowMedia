import { Modal, Button, Alert } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import UserCard from '../../SearchBar/UserCard'

function FollowersModal({ closeModal, title, following, followers }) {

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const users = following ? following : followers

    return (
        <Modal show={true} onHide={closeModal} centered className="modal fade bg-glass">
            <div className="rounded-4 shadow-sm p-4 border-0 bg-brown-gradient-color">
                <div className="modal-header border-0 p-1 mb-4">
                    <h6 className="modal-title fw-bold text-body fs-6">{title}</h6>
                    <a href="#" className="text-muted text-decoration-none material-icons ms-2 md-" onClick={closeModal}>close</a>
                </div>
                <div className="modal-body p-0">
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <div className="modal-content rounded-4 p-4 border-0">
                        <div className="bg-glass rounded-4 overflow-hidden shadow-sm account-follow mb-4">
                            {users.map(user => (
                                <UserCard key={user._id} other_user={user} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
export default FollowersModal