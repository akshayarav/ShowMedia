import { Modal, Button, Alert } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import UserCard from '../../SearchBar/UserCard'

function FollowersModal({ closeModal, title, following, followers }) {

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const users = following ? following : followers

    return (
        <Modal show={true} onHide={closeModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <div className="modal-content rounded-4 p-4 border-0">
                    <div className="bg-white rounded-4 overflow-hidden shadow-sm account-follow mb-4">
                        {users.map(user => (
                            <UserCard key={user._id} other_user={user.username} />
                        ))}
                    </div>
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
export default FollowersModal