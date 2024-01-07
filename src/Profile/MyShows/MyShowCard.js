import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyShowCard({ rating, showId }) {
    const [show, setShow] = useState(null);

    useEffect(() => {
        const url = `https://api.themoviedb.org/3/tv/${showId}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`;
        const fetchShow = async () => {
            try {
                const response = await axios.get(url); // Or directly to TMDb if CORS is handled
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
            <img src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} className="img-fluid rounded-circle me-3" alt="profile-img" />
            <div>
                <p className="fw-bold mb-0 pe-3 d-flex align-items-center"><a className="text-decoration-none text-dark">{show.name}</a></p>
                <div className="text-muted fw-light">
                    <p className="mb-1 small">Rating: {rating}</p>
                </div>
            </div>
            <div className="ms-auto">
                <div className="btn-group" role="group" aria-label="Basic checkbox toggle button group">
                    <input type="checkbox" className="btn-check" id="btncddheck7" />
                    <label className="btn btn-outline-primary btn-sm px-3 rounded-pill" htmlFor="btncddheck7"><span className="follow">Edit</span><span className="following d-none">Edit</span></label>
                </div>
            </div>
        </div>
    )
}

export default MyShowCard