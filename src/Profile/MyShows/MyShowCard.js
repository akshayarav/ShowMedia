import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyShowCard({ rating, showId, seasonNumber, comment, episodes }) {
    const [show, setShow] = useState(null);
    console.log(episodes)

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

    if (!show) return <div>Loading...</div>;

    return (
        <div className="p-3 border-bottom d-flex text-dark text-decoration-none account-item">
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
            {episodes && <p className="mb-1 small">Progress: {episodes}</p>}
        </div>
    );
}

export default MyShowCard;