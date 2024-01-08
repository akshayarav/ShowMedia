import React, { useState } from 'react';
import { Modal, Button, Alert, Form } from 'react-bootstrap';

function ShowModal({ closeModal, showName, showImg, series_id, seasons }) {
    const [selectedSeason, setSelectedSeason] = useState('');
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const userId = localStorage.getItem('userId');

        if (!userId) {
            setError('Log In First!');
            return;
        }

        if (!selectedSeason || !comment || !rating) {
            setError('Please select a season, enter a rating, and write a comment.');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/rateSeason`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    showId: series_id,
                    seasonNumber: selectedSeason,
                    rating: parseInt(rating),
                    comment
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || `Failed to add rating and comment for Season ${selectedSeason}`);
                return;
            }

            setSuccess('Season rating and comment added successfully!');
            setTimeout(() => {
                closeModal();
            }, 1000);

        } catch (err) {
            setError('Server error');
        }
    };

    return (
        <Modal show={true} onHide={closeModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Rate Seasons of {showName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <div className="image-container">
                    <img src={showImg} className="img-fluid" alt={showName} />
                </div>
                <form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Select Season</Form.Label>
                        <Form.Control as="select" value={selectedSeason} onChange={e => setSelectedSeason(e.target.value)}>
                            <option value="">Select a Season</option>
                            {seasons.map(season => (
                                <option key={season.season_number} value={season.season_number}>
                                    Season {season.season_number}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control type="number" min="1" max="10" placeholder="Enter rating" value={rating} onChange={e => setRating(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control as="textarea" rows={3} value={comment} onChange={e => setComment(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit">Submit</Button>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ShowModal;