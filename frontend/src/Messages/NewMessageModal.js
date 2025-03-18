import { Modal, Alert } from 'react-bootstrap';
import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from '../SearchBar/SearchBar';

function NewMessageModal({ closeModal, setUser }) {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const userId = localStorage.getItem('userId')
    const apiUrl = process.env.REACT_APP_API_URL;


    const handleSubmit = (otherUser) => {
        axios.post(`${apiUrl}/api/conversations/create`, { 
            userId1: userId, 
            userId2: otherUser._id
        })
        .then(response => {
            // Handle success
            setSuccess('Conversation created successfully');
            setUser(otherUser)
            closeModal(); // Optionally close the modal on success
        })
        .catch(error => {
            // Handle error
            setError('Error creating conversation: ' + error.message);
        });
    };


    return (
        <Modal show={true} onHide={closeModal} centered className="modal fade bg-glass">
            <div className="rounded-4 shadow-sm p-4 border-0 bg-brown-gradient-color" style={{ height: '700px' }}>
                <div className="modal-header border-0 p-1 mb-4">
                    <h6 className="modal-title fw-bold text-body fs-6">New Message</h6>
                    <a href="#" className="text-muted text-decoration-none material-icons ms-2 md-" onClick={closeModal}>close</a>
                </div>
                <div className="modal-body p-0">
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                        <SearchBar messages = {true} messagesSubmit = {handleSubmit}/>
                </div>
            </div>
        </Modal>
    )
}

export default NewMessageModal