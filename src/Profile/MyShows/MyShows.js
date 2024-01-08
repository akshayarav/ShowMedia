import MyShowCard from "./MyShowCard"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function MyShows() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const { username } = useParams();
    const [ratings, setRatings] = useState([]);
    const [watching, setWatching] = useState([])
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

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
    }, [username, apiUrl]);

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

    return (
        <div className="bg-white rounded-4 overflow-hidden shadow-sm account-follow mb-4">
            <div class="rounded-3">
                <div class="row justify-content-center">
                    <div class="col-lg-12">
                        <div class="accordion overflow-hidden bg-white" id="accordionExample">
                            <div class="accordion-item">
                                <h3 class="accordion-header" id="headingOne"><button class="accordion-button fw-bold m-0" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">Watching</button></h3>
                                <div class="accordion-collapse collapse show" id="collapseOne" aria-labelledby="headingOne" >
                                    <div class="accordion-body">
                                        {ratings.map(rating => {
                                            if (rating.status === "Watching") {
                                                return (
                                                    <MyShowCard
                                                        key={`${rating.show}-${rating.season}`}
                                                        rating={rating.rating}
                                                        showId={rating.show}
                                                        seasonNumber={rating.season}
                                                        comment={rating.comment}
                                                        status={rating.status}
                                                    />
                                                );
                                            } else {
                                                return null;
                                            }
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div class="accordion-item">
                                <h3 class="accordion-header" id="headingTwo"><button class="accordion-button fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">Completed</button></h3>
                                <div class="accordion-collapse collapse show" id="collapseTwo" aria-labelledby="headingOne" >
                                    <div class="accordion-body">
                                        {ratings.map(rating => {
                                            if (rating.status === "Completed") {
                                                return (
                                                    <MyShowCard
                                                        key={`${rating.show}-${rating.season}`}
                                                        rating={rating.rating}
                                                        showId={rating.show}
                                                        seasonNumber={rating.season}
                                                        comment={rating.comment}
                                                        status={rating.status}
                                                    />
                                                );
                                            } else {
                                                return null;
                                            }
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div class="accordion-item">
                                <h3 class="accordion-header" id="headingThree"><button class="accordion-button fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">Planning</button></h3>
                                <div class="accordion-collapse collapse show" id="collapseThree" aria-labelledby="headingThree" >
                                    <div class="accordion-body">
                                        {ratings.map(rating => {
                                            if (rating.status === "Planning") {
                                                return (
                                                    <MyShowCard
                                                        key={`${rating.show}-${rating.season}`}
                                                        rating={rating.rating}
                                                        showId={rating.show}
                                                        seasonNumber={rating.season}
                                                        comment={rating.comment}
                                                        status={rating.status}
                                                    />
                                                );
                                            } else {
                                                return null;
                                            }
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div class="accordion-item">
                                <h3 class="accordion-header" id="headingFour"><button class="accordion-button fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="true" aria-controls="collapseFour">Dropped</button></h3>
                                <div class="accordion-collapse collapse show" id="collapseFour" aria-labelledby="headingOne" >
                                    <div class="accordion-body">
                                        {ratings.map(rating => {
                                            if (rating.status === "Dropped") {
                                                return (
                                                    <MyShowCard
                                                        key={`${rating.show}-${rating.season}`}
                                                        rating={rating.rating}
                                                        showId={rating.show}
                                                        seasonNumber={rating.season}
                                                        comment={rating.comment}
                                                        status={rating.status}
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
    );
}

export default MyShows;
