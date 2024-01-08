import React, { useState } from 'react';
import { Modal, Button, Alert, Form } from 'react-bootstrap';

function ShowModal({ closeModal, showName, showImg, series_id, seasons }) {
    const [ratings, setRatings] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleRatingChange = (seasonNumber, value) => {
        setRatings(prevRatings => ({ ...prevRatings, [seasonNumber]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const userId = localStorage.getItem('userId');

        if (!userId) {
            setError('Log In First!');
            return;
        }

        for (const [seasonNumber, rating] of Object.entries(ratings)) {
            if (rating > 10 || rating < 1) {
                setError(`Rating for Season ${seasonNumber} must be on a scale of 1-10`);
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
                        seasonNumber,
                        rating
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || `Failed to add rating for Season ${seasonNumber}`);
                    return;
                }
            } catch (err) {
                setError('Server error');
                return;
            }
        }

        setSuccess('Season ratings added successfully!');
        setTimeout(() => {
            closeModal()
        }, 1000);
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
                    {seasons.map(season => (
                        <Form.Group key={season.season_number} className="mb-3">
                            <Form.Label>Season {season.season_number} Rating</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter rating"
                                value={ratings[season.season_number] || ''}
                                onChange={e => handleRatingChange(season.season_number, e.target.value)}
                            />
                        </Form.Group>
                    ))}
                    <Button variant="primary" type="submit">Submit Ratings</Button>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ShowModal;