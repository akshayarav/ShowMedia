import React, { useState, useEffect } from "react";
import { Modal, Button, Alert, Form } from "react-bootstrap";

function ShowModal({
    closeModal,
    showName,
    series_id,
    seasons,
    updateStatus,
}) {
    const apiUrl = process.env.REACT_APP_API_URL;

    //Stores the season ID
    const [selectedSeason, setSelectedSeason] = useState(seasons && seasons.length > 0 ? seasons[0].id : null);
    //Stores the season number
    const [selectedSeasonNum, setSelectedSeasonNum] = useState(seasons && seasons.length > 0 ? seasons[0].season_number : 1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [status, setStatus] = useState("");
    const [episodes, setEpisodes] = useState(0);
    const [episodeProgress, setEpisodeProgress] = useState(null);
    const [episodesTotal, setEpisodesTotal] = useState(0);

    const [isCommentVisible, setIsCommentVisible] = useState(false)

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [selectedSeasonObject, setSelectedSeasonObject] = useState(null);

    // First useEffect - only runs when season selection changes
    useEffect(() => {
        if (!seasons || seasons.length === 0) return;
        
        const seasonObj = seasons.find(
            (season) => season.id === parseInt(selectedSeason)
        );
        setSelectedSeasonObject(seasonObj);

        if (seasonObj) {
            const newEpisodesTotal = seasonObj.episodes ? seasonObj.episodes.length : 0;
            setEpisodesTotal(newEpisodesTotal);
            // Initialize episodes to 0 when season changes
            setEpisodes(0);
        }
    }, [selectedSeason, seasons]);

    // Second useEffect - only runs when episodes or episodesTotal change
    useEffect(() => {
        // Only update episodeProgress if both values are valid
        if (episodes !== null && episodesTotal !== null) {
            setEpisodeProgress(`${episodes}/${episodesTotal}`);
        } else {
            setEpisodeProgress(null);
        }
    }, [episodes, episodesTotal]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const userId = localStorage.getItem("userId");
        if (!userId) {
            setError("Log In First!");
            return;
        }

        if (!selectedSeason || !rating) {
            setError("Please select a season and enter a rating.");
            setTimeout(() => setError(""), 3000)
            return;
        }

        if (!status) {
            setError("Please select a status (Completed, Watching, Planning, or Dropped).");
            setTimeout(() => setError(""), 3000);
            return;
        }

        if (!selectedSeasonObject || selectedSeasonObject.season_number === undefined) {
            setError("Please select a valid season.");
            setTimeout(() => setError(""), 3000);
            return;
        }

        try {
            const tmdbResponse = await fetch(
                `https://api.themoviedb.org/3/tv/${series_id}/season/${selectedSeasonObject.season_number}?api_key=${process.env.REACT_APP_API_KEY}`
            );
            const seasonDetails = await tmdbResponse.json();

            const episodesWatched = episodeProgress && typeof episodeProgress === 'string' 
                ? parseInt(episodeProgress.match(/\d+/)?.[0] || "0", 10) 
                : parseInt(episodes || 0, 10);
            const averageRuntime = seasonDetails.episodes[0].runtime;
            const totalHours = (averageRuntime / 60) * episodesWatched;

            const response = await fetch(`${apiUrl}/api/seasonRatings/rateSeason`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    showId: series_id,
                    seasonNumber: selectedSeasonObject.season_number,
                    rating: parseInt(rating),
                    comment: comment,
                    status: status,
                    episodes: episodeProgress,
                    hours: totalHours,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(
                    data.message ||
                    `Failed to add rating and comment for Season ${selectedSeason}`
                );
                return;
            }

            setSuccess("Season rating and comment added successfully!");
            setTimeout(() => {
                closeModal();
            }, 1000);
        } catch (err) {
            console.error("Detailed error:", err);
            setError("Server error");
        } finally {
            if (updateStatus) {
                updateStatus();
            }
        }
    };

    return (
        <Modal
            show={true}
            onHide={closeModal}
            centered={true}
            className="fade modal"
        >
            <div className="rounded-4 shadow-sm p-3 border-0 bg-brown-gradient-color">
                <div className="d-flex justify-content-end">
                    <a
                        href="#"
                        className="text-muted text-decoration-none material-icons ms-2"
                        onClick={closeModal}
                    >
                        close
                    </a>
                </div>

                <div className="border-bottom text-center">
                    <h3 className="fw-bold text-white">{showName}</h3>
                </div>
                <div className="modal-body p-2 mt-4">
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <div className="d-flex justify-content-between">
                        <form onSubmit={handleSubmit} className="flex-grow-1">
                            <div className="container">
                                <div className="row d-flex justify-content-center">
                                    <div className="col-5 d-flex text-center">
                                        <div className="dropdown flex-grow-1">
                                            <Button
                                                variant="primary"
                                                type="button"
                                                className="btn btn-primary"
                                                style={{ width: "100%", height: "auto" }}
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                <div className="d-flex align-items-center justify-content-center">
                                                    Season {selectedSeasonNum}
                                                    <span className="material-icons md-20">
                                                        expand_more
                                                    </span>
                                                </div>
                                            </Button>
                                            <ul
                                                className="dropdown-menu fs-13 dropdown-menu-end"
                                                aria-labelledby="dropdownMenuButton7"

                                            >
                                                {seasons?.map(season => (
                                                    <li>
                                                        <button
                                                            key={season.id}
                                                            value={season.id}
                                                            className="dropdown-item text-muted"
                                                            htmlFor={`btncheck${season.id}`}
                                                            onClick={(e) => { e.preventDefault(); setSelectedSeason(season.id); setSelectedSeasonNum(season.season_number) }}>
                                                            Season {season.season_number}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className={`row mt-2 mb-2 p-2 fade-in ${selectedSeason ? 'visible' : ''}`}>
                                    <div className="col-12 bg-glass rounded-4 p-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex text-center align-items-center">
                                                <span className="material-icons md-20 me-3" style={{ maxWidth: "20px" }}>live_tv_outlined</span>
                                                <div className="fw-bold text-muted">Episodes Seen</div>
                                            </div>
                                            <div className="mt-1">
                                                <div className="review-score text-muted mb-1">
                                                    <input
                                                        type="number"
                                                        value={episodes}
                                                        onChange={(e) => setEpisodes(e.target.value)}
                                                        onBlur={(e) => {
                                                            if (e.target.value === '') {
                                                                setEpisodes(0);
                                                            }
                                                        }}
                                                        min="0"
                                                        max={episodesTotal}
                                                        className="text-muted fw-bold"
                                                        style={{
                                                            border: 'none',
                                                            outline: 'none',
                                                            background: 'transparent',
                                                            width: 'auto',
                                                            textAlign: 'right',
                                                        }}
                                                    /> / {episodesTotal}
                                                </div>
                                            </div>
                                        </div>
                                        <Form.Group className={`mt-2 `}>
                                            <Form.Control
                                                type="range"
                                                min="0"
                                                max={episodesTotal}
                                                value={episodes}
                                                onChange={(e) => setEpisodes(e.target.value)}
                                                className="progress-bar bg-brown rounded-4"
                                                id="customRange"
                                            />
                                        </Form.Group>
                                    </div>
                                </div>

                                <div className="row mt-2 mb-2 p-2">
                                    <div className="col-12 bg-glass rounded-4 p-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex text-center align-items-center">
                                                <span className="material-icons md-20 me-3" style={{ maxWidth: "20px" }}>star_border_outlined</span>
                                                <div className="fw-bold text-muted">Rating</div>
                                            </div>
                                            <div className="mt-1">
                                                <div className="review-score text-muted mb-1">
                                                <input
                                                        type="number"
                                                        value={rating}
                                                        onChange={(e) => setRating(e.target.value)}
                                                        onBlur={(e) => {
                                                            if (e.target.value === '') {
                                                                setRating(0);
                                                            }
                                                        }}
                                                        min="0"
                                                        max={100}
                                                        className="text-muted fw-bold"
                                                        style={{
                                                            border: 'none',
                                                            outline: 'none',
                                                            background: 'transparent',
                                                            width: 'auto',
                                                            textAlign: 'right',
                                                        }}
                                                    /> / {100}
                                                </div>
                                            </div>
                                        </div>
                                        <Form.Group className={`mt-2`}>
                                            <Form.Control
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={rating}
                                                onChange={(e) => setRating(e.target.value)}
                                                className="progress-bar bg-brown rounded-4"
                                                id="customRange"
                                            />
                                        </Form.Group>
                                    </div>
                                </div>

                                <div className={`row mt-2 mb-2 p-2`}>
                                    <div className="col-12 bg-glass rounded-4 p-3">
                                        <div role="button" onClick={() => setIsCommentVisible(!isCommentVisible)} className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex text-center align-items-center">
                                                <span className="material-icons md-20 me-3">notes</span>
                                                <div className="fw-bold text-muted">Add a comment</div>
                                            </div>
                                        </div>
                                        <Form.Group className={`mt-2 fade-in ${isCommentVisible ? 'visible' : ''}`}>
                                            <Form.Control
                                                as="textarea"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}

                                            />
                                        </Form.Group>

                                    </div>
                                </div>
                            </div>

                            <div className="container mt-4">
                                <div className="row ">
                                    <div className="col-6">
                                        <div className="mt-2">
                                            <button
                                                className="btn btn-outline-primary rounded-pill mb-1"
                                                style={{
                                                    width: "100%",
                                                    backgroundColor: status === "Completed" ? '#e76f51' : undefined,
                                                    color: status === "Completed" ? 'white' : undefined
                                                }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setStatus("Completed");
                                                }}
                                            >
                                                <span className="material-icons md-13 me-1">
                                                    add_task
                                                </span>
                                                Completed
                                            </button>
                                            <button
                                                className="btn btn-outline-primary rounded-pill mb-1"
                                                style={{
                                                    width: "100%",
                                                    backgroundColor: status === "Watching" ? '#e76f51' : undefined,
                                                    color: status === "Watching" ? 'white' : undefined
                                                }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setStatus("Watching");
                                                }}
                                            >
                                                <span className="material-icons md-13 me-1">
                                                    theaters
                                                </span>
                                                Watching
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="mt-2">
                                            <button
                                                className="btn btn-outline-primary rounded-pill mb-1"
                                                style={{
                                                    width: "100%",
                                                    backgroundColor: status === "Planning" ? '#e76f51' : undefined,
                                                    color: status === "Planning" ? 'white' : undefined
                                                }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setStatus("Planning");
                                                }}
                                            >
                                                <span className="material-icons md-13 me-1">
                                                    date_range
                                                </span>
                                                Planning
                                            </button>
                                            <button
                                                className="btn btn-outline-primary rounded-pill mb-1"
                                                style={{
                                                    width: "100%",
                                                    backgroundColor: status === "Dropped" ? '#e76f51' : undefined,
                                                    color: status === "Dropped" ? 'white' : undefined
                                                }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setStatus("Dropped");
                                                }}
                                            >
                                                <span className="material-icons md-13 me-1">
                                                    cancel
                                                </span>
                                                Dropped
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <Button
                                variant="primary"
                                type="submit"
                                className="btn btn-primary w-100 text-decoration-none rounded-5 py-3 fw-bold text-uppercase mt-4"
                            >
                                Add to MY List
                            </Button>
                        </form>
                    </div>
                </div>
            </div >
        </Modal >
    );
}

export default ShowModal;
