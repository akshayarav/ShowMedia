import React, { useState, useEffect } from 'react';
import { Modal, Button, Alert, Form } from 'react-bootstrap';

function ShowModal({ closeModal, showName, showImg, series_id, seasons, updateStatus }) {
    const [selectedSeason, setSelectedSeason] = useState('');
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [status, setStatus] = useState('')
    const apiUrl = process.env.REACT_APP_API_URL;
    const [selectedSeasonObject, setSelectedSeasonObject] = useState(null);
    const [episodesTotal, setEpisodesTotal] = useState(null);
    const [episodes, setEpisodes] = useState('');
    const [episodeProgress, setEpisodeProgress] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const seasonObj = seasons.find(season => season.id === parseInt(selectedSeason));
        setSelectedSeasonObject(seasonObj);

        if (seasonObj) {
            const newEpisodesTotal = seasonObj.episodes.length;
            setEpisodesTotal(newEpisodesTotal);
        }

        if (episodes && episodesTotal) {
            setEpisodeProgress(`${episodes}/${episodesTotal}`);
        }


    }, [selectedSeason, seasons, episodes]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        const userId = localStorage.getItem('userId');

        if (!userId) {
            setError('Log In First!');
            return;
        }

        if (!selectedSeason || !comment || !rating || !status) {
            setError('Please select a status, a season, enter a rating, and write a comment.');
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
                    seasonNumber: selectedSeasonObject.season_number,
                    rating: parseInt(rating),
                    comment: comment,
                    status: status,
                    episodes: episodeProgress
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
                setIsSubmitting(false);
            }, 1000);

        } catch (err) {
            setError('Server error');
            setIsSubmitting(false);
        } finally {
            if (updateStatus) { updateStatus() }
        }
    };

    return (
        <Modal show={true} onHide={closeModal} centered={true} className="modal fade bg-glass">
            <div className="rounded-4 shadow-sm p-4 border-0 bg-brown-gradient-color">
                <div className="modal-header border-0 p-1 mb-4">
                    <h6 className="modal-title fw-bold text-body fs-6">Rate Seasons of {showName}</h6>
                    <a href="#" class="text-muted text-decoration-none material-icons ms-2 md-" onClick={closeModal}>close</a>
                </div>
                <div class="modal-body p-0">
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <div className="">
                        <form onSubmit={handleSubmit}>

                            <div className="d-flex align-items-center">
                                <div className="image-container showmodal">
                                    <img
                                        src={selectedSeasonObject && selectedSeasonObject.poster_path ? `https://image.tmdb.org/t/p/w500${selectedSeasonObject.poster_path}` : showImg}
                                        className="img-fluid showmodal-img"
                                        alt={showName}
                                    />
                                </div>
                                <div className="flex-grow-1 offset-xl-1 ms-2 col-xl-5">
                                    <Form.Group className="mb-3">
                                        <h6 class="fw-bold mx-1 mb-2 text-white">Status</h6>
                                        <Form.Control as="select" value={status} onChange={e => setStatus(e.target.value)}>
                                            <option value="">Select Status</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Watching">Watching</option>
                                            <option value="Planning">Planning</option>
                                            <option value="Dropped">Dropped</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <h6 class="fw-bold mx-1 mb-2 text-white">Season</h6>
                                        <Form.Control as="select" value={selectedSeason} onChange={e => setSelectedSeason(e.target.value)}>
                                            <option value="">Select Season</option>
                                            {seasons.map(season => (
                                                <option key={season.id} value={season.id}>
                                                    Season {season.season_number}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    {status === "Watching" && selectedSeason && <Form.Group className="mb-3">
                                        <h6 class="fw-bold mx-1 mb-2 text-white">Episodes</h6>

                                        <Form.Control type="number" min="1" max={episodesTotal} placeholder={`Enter episodes watched (${episodesTotal} Total)`} value={episodes} onChange={e => setEpisodes(e.target.value)} />
                                    </Form.Group>}
                                    <Form.Group className="mb-3">
                                        <h6 class="fw-bold mx-1 mb-2 text-white">Rating</h6>
                                        <Form.Control type="number" min="1" max="10" placeholder="Enter rating" value={rating} onChange={e => setRating(e.target.value)} />
                                    </Form.Group>

                                </div>
                            </div>
                            <Form.Group className="mb-3">
                                <h6 class="fw-bold mx-1 mt-2 text-white">Comment</h6>
                                <Form.Control as="textarea" rows={3} value={comment} onChange={e => setComment(e.target.value)} />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="btn btn-primary w-100 text-decoration-none rounded-5 py-3 fw-bold text-uppercase mt-4" disabled={isSubmitting}>Submit</Button>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ShowModal;