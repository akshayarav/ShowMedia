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
        <div class="feeds">
            <div className="bg-glass p-4 feed-item rounded-4 shadow-sm faq-page account-follow">
                <div className="rounded-3">
                    <div className="row justify-content-center">
                        <div className="col-lg-12">
                            <div className="accordion overflow-hidden bg-glass" id="accordionExample">
                                <div className="accordion-item">
                                    <h3 className="accordion-header" id="headingOne"><button className="accordion-button fw-bold m-0" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">Watching</button></h3>
                                    <div className="accordion-collapse collapse show" id="collapseOne" aria-labelledby="headingOne" >
                                        <div className="accordion-body">
                                            {sortedRatings.map(rating => {
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
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h3 className="accordion-header" id="headingTwo"><button className="accordion-button fw-bold m-0" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">Completed</button></h3>
                                    <div className="accordion-collapse collapse show" id="collapseTwo" aria-labelledby="headingOne" >
                                        <div className="accordion-body">
                                            {sortedRatings.map(rating => {
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
                                    </div>
                                </div>

                                <div className="accordion-item">
                                    <h3 className="accordion-header" id="headingThree"><button className="accordion-button fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">Planning</button></h3>
                                    <div className="accordion-collapse collapse show" id="collapseThree" aria-labelledby="headingThree" >
                                        <div className="accordion-body">
                                            {sortedRatings.map(rating => {
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
                                    </div>
                                </div>

                                <div className="accordion-item">
                                    <h3 className="accordion-header" id="headingFour"><button className="accordion-button fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="true" aria-controls="collapseFour">Dropped</button></h3>
                                    <div className="accordion-collapse collapse show" id="collapseFour" aria-labelledby="headingOne" >
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyShows;
