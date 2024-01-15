import React, { useState, useEffect } from 'react';
import { Modal, Button, Alert, Form } from 'react-bootstrap';
import UserCard from '../../SearchBar/UserCard';

function ShowModal({ closeModal, showName, showImg, series_id, seasons, updateStatus, users, status }) {
    const [selectedSeason, setSelectedSeason] = useState('');
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;
    const [selectedSeasonObject, setSelectedSeasonObject] = useState(null);
    const [episodesTotal, setEpisodesTotal] = useState(null);
    const [episodes, setEpisodes] = useState('');
    const [episodeProgress, setEpisodeProgress] = useState(null);
    const [showMore, setShowMore] = useState(false);

    console.log("USERS: " + users)
    console.log("seasons: " + seasons)

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

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

        if (!selectedSeason || !comment || !rating) {
            setError('Please select a season, enter a rating, and write a comment.');
            return;
        }

        console.log(JSON.stringify({
            userId,
            showId: series_id,
            seasonNumber: selectedSeasonObject.season_number,
            rating: parseInt(rating),
            comment: comment,
            status: status,
            episodes: episodeProgress
        }))

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
    const renderStars = (rating) => {
        let stars = [];
        for (let i = 1; i <= 10; i++) {
            stars.push(
                <div key={i} className="star" role = "button" onClick = {() => setRating(i)}>
                    <span className="material-icons">
                        {i <= rating ? 'star' : 'star_border'}
                    </span>
                </div>
            );
        }
        return <div className="stars-container">{stars}</div>;
    };

    const status_title = status === "Completed" ? (
        <div className="d-flex ">
            <h6 className> Status: Completed  </h6>
            <span className="material-icons ms-1">add_task</span>
        </div>
    ) : (status === "Watching" ? (
        <>
            <div className="d-flex justify-content-between">
                <h6> Status: Watching </h6>
                <span className="material-icons ms-1">theaters</span>
            </div>

        </>
    ) : (status === "Planning" ? (
        <>
            <div className="d-flex ">
                <h6> Status: Planning </h6>
                <span className="material-icons ms-1">date_range</span>
            </div>

        </>
    ) : (
        <>
            <div className="d-flex ">
                <h6> Status: Dropped </h6>
                <span className="material-icons ms-1">close</span>
            </div>
        </>
    )
    ))

    if (window.innerWidth < 1200) {
        return (
            <Modal show={true} onHide={closeModal} centered={true} className="fade bg-glass modal-xl">
                <div className="rounded-4 shadow-sm p-4 border-0 bg-brown-gradient-color">
                    <div className="modal-header border-0 p-1 mb-4">
                        <h6 className="modal-title fw-bold text-primary fs-6">{showName}</h6>
                        <a href="#" className="text-muted text-decoration-none material-icons ms-2 md-" onClick={closeModal}>close</a>
                    </div>
                    <div className="modal-body p-0">
                        <h4 className="text-muted ms-2"> {status_title}</h4>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">{success}</Alert>}
                        <div className="d-flex justify-content-between">
                            <form onSubmit={handleSubmit} className="flex-grow-1">
                                <div className="d-flex">
                                    <div className="image-container showmodal">
                                        <img
                                            src={selectedSeasonObject && selectedSeasonObject.poster_path ? `https://image.tmdb.org/t/p/w500${selectedSeasonObject.poster_path}` : showImg}
                                            className="img-fluid showmodal-img"
                                            alt={showName}
                                        />
                                    </div>
                                    <div className="flex-grow-1 offset-xl-1 ms-2 col-xl-5">
                                        <Form.Group className="mb-3">
                                            <h6 className="fw-bold mx-1 mb-2 text-white">Season:</h6>
                                            <Form.Control as="select" value={selectedSeason} onChange={e => setSelectedSeason(e.target.value)}>
                                                <option value="">Select Season</option>
                                                {seasons.map(season => (
                                                    <option key={season.id} value={season.id}>
                                                        Season {season.season_number}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <h6 className="fw-bold mx-1 mb-2 text-white">Episodes Seen</h6>

                                            <Form.Control type="number" min="1" max={episodesTotal} placeholder={`(${episodesTotal} Total)`} value={episodes} onChange={e => setEpisodes(e.target.value)} />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <h6 className="fw-bold mx-1 mb-2 text-white">Rating</h6>
                                            <Form.Control type="number" min="1" max="10" placeholder="Enter rating" value={rating} onChange={e => setRating(e.target.value)} />
                                        </Form.Group>
                                    </div>
                                </div>
                                <Form.Group className="mb-3">
                                    <h6 className="fw-bold mx-1 mt-2 text-white">Comment</h6>
                                    <Form.Control as="textarea" rows={3} value={comment} onChange={e => setComment(e.target.value)} />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="btn btn-primary w-100 text-decoration-none rounded-5 py-3 fw-bold text-uppercase mt-1">Submit</Button>
                            </form>
                        </div>
                        {!showMore && (
                            <div className="d-flex justify-content-center">
                                <Button variant="primary" className="mt-3" onClick={toggleShowMore}>Who's Seen?
                                    <div>
                                        <span className="material-icons">expand_more</span>
                                    </div>
                                </Button>
                            </div>
                        )}
                        {showMore && (
                            <div className="p-3 scrollable-div">
                                <div className="bg-glass rounded-4 overflow-hidden shadow-sm account-follow mb-4">
                                    {users && users.length > 0 &&
                                        <h6 className="fw-bold text-body p-3 mb-0 border-bottom">Seen By</h6>}
                                    {users.map(user => <small key={user}><UserCard username={user} /></small>)}
                                    <Button variant="primary" className="mt-3" onClick={toggleShowMore}><span className="material-icons">expand_less</span></Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        )
    }

    return (
        <Modal show={true} onHide={closeModal} centered={true} className="fade bg-glass modal">
            <div className="rounded-4 shadow-sm p-4 border-0 bg-brown-gradient-color">
                <div className="modal-header border-0 p-1 mb-4">
                    <h3 className="fw-bold text-primary">{showName}</h3>
                    <a href="#" className="text-muted text-decoration-none material-icons ms-2 md-" onClick={closeModal}>close</a>
                </div>
                <h4 className="text-muted ms-2"> {status_title}</h4>
                <div className="modal-body p-0">
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <div className="d-flex justify-content-between">
                        <form onSubmit={handleSubmit} className="flex-grow-1">
                            <div className="container">
                                <div className="row">
                                    <div className="image-container showmodal col-6">
                                        <img
                                            src={selectedSeasonObject && selectedSeasonObject.poster_path ? `https://image.tmdb.org/t/p/w500${selectedSeasonObject.poster_path}` : showImg}
                                            className="img-fluid showmodal-img"
                                            alt={showName}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <div className="container">
                                            <Form.Group className="mb-3 row">
                                                <h4 className="fw-bold text-white col-3 me-4">Season:</h4>
                                                <div className="col-10">
                                                    <Form.Control as="select" value={selectedSeason} onChange={e => setSelectedSeason(e.target.value)} >
                                                        <option value="">Select</option>
                                                        {seasons.map(season => (
                                                            <option key={season.id} value={season.id}>
                                                                Season {season.season_number}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </div>
                                            </Form.Group>
                                            {<Form.Group className="mb-3">
                                                <h4 className="fw-bold text-white col-10 me-4">Ep. Seen:</h4>
                                                <div className="col-10">
                                                    <Form.Control className="white-placeholder" type="number" min="1" max={episodesTotal} placeholder={`(${episodesTotal} Total)`} value={episodes} onChange={e => setEpisodes(e.target.value)} />
                                                </div>
                                            </Form.Group>}
                                            <Form.Group className="row mb-0">
                                                <h4 className="fw-bold text-white col-3 me-4">Rating:</h4>
                                                <div className="col-10 text-white">
                                                    <Form.Control className="white-placeholder" type="number" min="1" max="10" placeholder="(1-10)" value={rating} onChange={e => setRating(e.target.value)} />
                                                </div>
                                            </Form.Group>
                                            <div className="row">
                                                <div className="col-4">
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <Form.Group className="mt-3 mb-3">
                                    <h3 className="fw-bold text-white col-3 me-5">Comment:</h3>
                                    <Form.Control as="textarea" rows={3} value={comment} onChange={e => setComment(e.target.value)} />
                                </Form.Group>
                                <h2>{renderStars(rating)}</h2>
                                <Button variant="primary" type="submit" className="btn btn-primary w-100 text-decoration-none rounded-5 py-3 fw-bold text-uppercase">Submit</Button>
                            </div>
                        </form>

                    </div>
                    {!showMore && (
                        <div className="d-flex justify-content-center">
                            <Button variant="primary" className="mt-3" onClick={toggleShowMore}>Who's Seen?
                                <div>
                                    <span className="material-icons">expand_more</span>
                                </div>
                            </Button>
                        </div>
                    )}
                    {showMore && (
                        <div>
                            <div className="d-flex justify-content-center">
                                <Button variant="primary" className="mt-3" onClick={toggleShowMore}><span className="material-icons">expand_less</span></Button>
                            </div>
                            <div className="p-3 scrollable-div">
                                <div className="bg-glass rounded-4 overflow-hidden shadow-sm account-follow mb-4">
                                    {users && users.length > 0 &&
                                        <h6 className="fw-bold text-body p-3 mb-0 border-bottom">Seen By</h6>}
                                    {users.map(user => <small key={user}><UserCard username={user} /></small>)}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ShowModal;