import MyShowCard from "./MyShowCard"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function MyShows() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const { username } = useParams();
    const [ratings, setRatings] = useState([]);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [reload, toggleReload] = useState(false)

    const watchingRatings = ratings.filter(rating => rating.status === "Watching");
    const completedRatings = ratings.filter(rating => rating.status === "Completed");
    const planningRatings = ratings.filter(rating => rating.status === "Planning");
    const droppedRatings = ratings.filter(rating => rating.status === "Dropped");

    useEffect(() => {
        axios.get(`${apiUrl}/api/user/${username}`)
            .then(response => {
                setUserData(response.data);
                fetchRatings(response.data._id);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setError(error.message || 'Error fetching user data');
            });
    }, [username, apiUrl, reload]);

    const fetchRatings = async (userId) => {
        try {
            const response = await axios.get(`${apiUrl}/api/seasonRatings/${userId}`);
            setRatings(response.data);
        } catch (error) {
            console.error('Error fetching season ratings', error);
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!userData) {
        return <div>Loading...</div>;
    }

    const sortedRatings = [...ratings].sort((a, b) => b.rating - a.rating);

    const updateStatus = () => {
        toggleReload(prevReload => !prevReload);
    };


    return (
        <div className="feeds">
            <div className="p-4 feed-item rounded-4 shadow-sm faq-page account-follow">
                <div className="rounded-3">
                    <div className="row justify-content-center">
                        <div className="col-lg-12">
                            {watchingRatings?.length > 0 && <div className="mb-4">
                                <h5 className="fw-bold text-primary"> Watching </h5>
                                <div className="bg-glass">
                                    {watchingRatings.map(rating => {
                                        if (rating.status === "Watching") {
                                            return (
                                                <MyShowCard
                                                    key={`${rating.show}-${rating.season}`}
                                                    rating={rating.rating}
                                                    showId={rating.show}
                                                    seasonNumber={rating.season}
                                                    comment={rating.comment}
                                                    episodes={rating.episodes}
                                                    status={rating.status}
                                                    updateStatus={updateStatus}
                                                />
                                            );
                                        } else {
                                            return null;
                                        }
                                    })}
                                </div>
                            </div>}
                            {completedRatings?.length > 0 && <div className="mb-4">
                                <h5 className="fw-bold text-primary"> Completed </h5>
                                <div className="bg-glass">
                                    {completedRatings.map(rating => {
                                        if (rating.status === "Completed") {
                                            return (
                                                <MyShowCard
                                                    key={`${rating.show}-${rating.season}`}
                                                    rating={rating.rating}
                                                    showId={rating.show}
                                                    seasonNumber={rating.season}
                                                    comment={rating.comment}
                                                    status={rating.status}
                                                    updateStatus={updateStatus}

                                                />
                                            );
                                        } else {
                                            return null;
                                        }
                                    })}
                                </div>
                            </div>}

                            {planningRatings?.length > 0 && <div className="mb-4">
                                <h5 className="fw-bold text-primary"> Planning </h5>
                                <div className="accordion-body">
                                    {planningRatings.map(rating => {
                                        if (rating.status === "Planning") {
                                            return (
                                                <MyShowCard
                                                    key={`${rating.show}-${rating.season}`}
                                                    rating={rating.rating}
                                                    showId={rating.show}
                                                    seasonNumber={rating.season}
                                                    comment={rating.comment}
                                                    status={rating.status}
                                                    updateStatus={updateStatus}

                                                />
                                            );
                                        } else {
                                            return null;
                                        }
                                    })}
                                </div>
                            </div>}

                            {droppedRatings?.length > 0 && <div className="mb-4">
                                <h5 className="fw-bold text-primary"> Dropped </h5>
                                <div className="accordion-body">
                                    {sortedRatings.map(rating => {
                                        if (rating.status === "Dropped") {
                                            return (
                                                <MyShowCard
                                                    key={`${rating.show}-${rating.season}`}
                                                    rating={rating.rating}
                                                    showId={rating.show}
                                                    seasonNumber={rating.season}
                                                    comment={rating.comment}
                                                    status={rating.status}
                                                    updateStatus={updateStatus}
                                                />
                                            );
                                        } else {
                                            return null;
                                        }
                                    })}
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyShows;
