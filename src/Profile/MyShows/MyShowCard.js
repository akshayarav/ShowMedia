import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyShowCard({ rating, showId, seasonNumber, comment, episodes, status, updateRatingStatus }) {
    const [show, setShow] = useState(null);
    const [episodeUpdate, setEpisodeUpdate] = useState(episodes)

    const userId = localStorage.getItem('userId');
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const url = `https://api.themoviedb.org/3/tv/${showId}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`;
        const fetchShow = async () => {
            try {
                const response = await axios.get(url);
                setShow(response.data);
            } catch (error) {
                console.error('Error fetching show details:', error);
            }
        };

        fetchShow();
    }, [showId]);

    const handleNewEpisode = async (e) => {
        e.preventDefault();

        let parts = episodeUpdate.split('/');
        let watchedEpisodes = parseInt(parts[0]) + 1;
        if (watchedEpisodes >= parseInt(parts[1])) {
            watchedEpisodes = parseInt(parts[1]);
            status = "Completed";
            updateRatingStatus(showId, seasonNumber, status);
        }
        let newEpisodes = `${watchedEpisodes}/${parts[1]}`;
        setEpisodeUpdate(newEpisodes)


        try {
            console.log("REACHED");
            const response = await fetch(`${apiUrl}/rateSeason`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    showId: showId,
                    seasonNumber: seasonNumber,
                    rating: parseInt(rating),
                    comment: comment,
                    status: status,
                    episodes: episodeUpdate
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error(data.message);
                return;
            }

        } catch (err) {
        }
    }

    if (!show) return <div>Loading...</div>;

    return (
        <div className="p-3 border-bottom d-flex align-items-center text-dark text-decoration-none account-item">
            <img src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} className="img-fluid rounded-circle me-3" alt={show.name} />
            <div>
                <p className="fw-bold mb-0 pe-3 d-flex align-items-center">
                    <a href="#" className="text-decoration-none text-dark">{show.name} - Season {seasonNumber}</a>
                </p>
                <div className="text-muted fw-light">
                    <p className="mb-1 small">Rating: {rating}</p>
                    {comment && <p className="mb-1 small">"{comment}"</p>}
                </div>
            </div>

            {status === "Watching" && <div className="ms-auto text-center">
                {episodes && <p className="mb-1 fw-bold">Episodes: {episodeUpdate}</p>}

                <div className="btn-group" role="group" aria-label="Basic checkbox toggle button group">
                    <button type="button" className="btn btn-outline-primary btn-sm px-3 rounded-pill" onClick={handleNewEpisode}>
                        Episode +
                    </button>
                </div>
            </div>}
        </div>


    );
}

export default MyShowCard;