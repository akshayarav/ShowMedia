import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ShowModal from '../../Shows/ShowCard/ShowModal';
import error from './error.jpg'

function MyShowCard({ rating, showId, seasonNumber, comment, episodes, status, updateStatus }) {
    const [show, setShow] = useState('');
    const [episodeUpdate, setEpisodeUpdate] = useState(episodes)
    const { username } = useParams();
    const [showModal, setShowModal] = useState(false);

    const auth_username = localStorage.getItem('username')
    const isAuthenticated = auth_username === username

    const userId = localStorage.getItem('userId');
    const apiUrl = process.env.REACT_APP_API_URL;

    const [seasons, setSeasons] = useState([]);

    useEffect(() => {
        const fetchSeasons = async () => {
            try {
                const seriesResponse = await axios.get(`https://api.themoviedb.org/3/tv/${showId}?api_key=${process.env.REACT_APP_API_KEY}`);
                const totalSeasons = seriesResponse.data.number_of_seasons;

                let seasonsDetails = [];
                for (let i = 1; i <= totalSeasons; i++) {
                    const seasonResponse = await axios.get(`https://api.themoviedb.org/3/tv/${showId}/season/${i}?api_key=${process.env.REACT_APP_API_KEY}`);
                    seasonsDetails.push(seasonResponse.data);
                }
                setSeasons(seasonsDetails);
            } catch (error) {
                console.error('Error fetching season details: ', error);
            }
        };

        fetchSeasons();
    }, [showId]);

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
        }
        let newEpisodes = `${watchedEpisodes}/${parts[1]}`;
        setEpisodeUpdate(newEpisodes)


        try {
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
                    episodes: newEpisodes
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error(data.message);
                return;
            }

        } catch (err) {
            console.error(err)
        } finally {
            updateStatus();
        }
    }

    const handleShowDel = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${apiUrl}/delSeason`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    showId: showId,
                    seasonNumber: seasonNumber
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error(data.message);
                return;
            }

        } catch (err) {
            console.error(err)
        } finally {
            updateStatus();
        }
    }

    const toggleShowModal = () => { setShowModal(!showModal); };

    if (!show) return <div>Loading...</div>;

    const image = show && show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : error;

    return (
        <div className="p-3 border-bottom d-flex flex-column text-dark text-decoration-none account-item">
            <div className="d-flex align-items-start justify-content-between">
                <div className="d-flex align-items-center">
                    <img src={image} className="img-fluid rounded-circle me-3" alt={show.name} />
                    <div>
                        <p className="fw-bold mb-0">
                            <a href="#" className="text-decoration-none text-dark">{show.name} - Season {seasonNumber}</a>
                        </p>
                        <div className="text-muted fw-light">
                            <p className="mb-1 small">Rating: {rating}</p>
                            {comment && <p className="mb-1 small">"{comment}"</p>}
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-column justify-content-between" style={{ height: '100%' }}>
                    {isAuthenticated && <div className="ms-auto">
                        <a href="#" className="text-muted text-decoration-none material-icons ms-2 md-20 rounded-circle bg-glass p-1" id="dropdownMenuButton6" data-bs-toggle="dropdown" aria-expanded="false">more_vert</a>
                        <ul className="dropdown-menu fs-13 dropdown-menu-end" aria-labelledby="dropdownMenuButton6">
                            <li>
                                <button onClick={toggleShowModal} className="dropdown-item text-muted" htmlFor="btncheck1">
                                    <span className="material-icons md-13 me-1">edit</span>
                                    Edit Show
                                </button>
                                {showModal && <ShowModal closeModal={toggleShowModal} showName={show.name} showImg={show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : error} series_id={showId} seasons={seasons} updateStatus={updateStatus} />}
                            </li>
                            <li>
                                <button onClick={handleShowDel} className="dropdown-item text-muted" htmlFor="btncheck2">
                                    <span className="material-icons md-13 me-1">delete</span>
                                    Remove Show
                                </button>
                            </li>
                        </ul>
                    </div>}


                    <div className="d-flex flex-row align-items-end">
                        {status === "Watching" && isAuthenticated && (
                            <div className="me-2">
                                <div className="btn-group" role="group" aria-label="Basic checkbox toggle button group">
                                    <button type="button" className="btn btn-outline-primary btn-sm px-3 rounded-pill custom-button" onClick={handleNewEpisode}>
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        {status === "Watching" && (
                            <div className="align-self-end">
                                <p className="mb-1 fw-bold">Progress: {episodeUpdate}</p>
                            </div>
                        )}
                    </div>


                </div>

            </div>

        </div >
    );

}

export default MyShowCard;