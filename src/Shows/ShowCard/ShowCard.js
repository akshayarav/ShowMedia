import { useState, useEffect } from "react";
import Axios from "axios";
import ShowModal from "./ShowModal";
import { Link } from "react-router-dom";

function ShowCard({ name, image, series_id, users }) {
    const [showModal, setShowModal] = useState(false);
    const [seasons, setSeasons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userSet, setUserSet] = useState(null)
    const [showCompletedModal, setShowCompletedModal] = useState(false);
    const [showWatchingModal, setShowWatchingModal] = useState(false);
    const [showPlanningModal, setShowPlanningModal] = useState(false);
    const [showDroppedModal, setShowDroppedModal] = useState(false);


    // Define toggle functions for each modal
    const toggleShowCompletedModal = () => setShowCompletedModal(!showCompletedModal);
    const toggleShowWatchingModal = () => setShowWatchingModal(!showWatchingModal);
    const toggleShowPlanningModal = () => setShowPlanningModal(!showPlanningModal);
    const toggleShowDroppedModal = () => setShowDroppedModal(!showDroppedModal);


    useEffect(() => {
        if (users) {
            const uniqueUsers = users.filter((value, index, array) => {
                return array.indexOf(value) === index;
            });
            setUserSet(uniqueUsers);
        }
    }, [users]);

    useEffect(() => {
        const fetchSeasons = async () => {
            try {
                setIsLoading(true);
                const seriesResponse = await Axios.get(`https://api.themoviedb.org/3/tv/${series_id}?api_key=${process.env.REACT_APP_API_KEY}`);
                const totalSeasons = seriesResponse.data.number_of_seasons;

                let seasonsDetails = [];
                for (let i = 1; i <= totalSeasons; i++) {
                    const seasonResponse = await Axios.get(`https://api.themoviedb.org/3/tv/${series_id}/season/${i}?api_key=${process.env.REACT_APP_API_KEY}`);
                    seasonsDetails.push(seasonResponse.data);
                }
                setSeasons(seasonsDetails);
            } catch (error) {
                console.error('Error fetching season details: ', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSeasons();
    }, [series_id]);


    return (
        <main className="flex-shrink-0 col col-xl-3 col-lg-6 col-md-3 col-sm-6 col-6 show-card-size">
            <div className="bg-glass rounded-4 shadow-sm" >
                <div>
                    <Link to={`/shows/${series_id}`}> {/* Add this Link component */}
                        <div className="image-container">
                            <img src={image} className="img-fluid rounded-top" alt={name} />
                        </div>
                        <div className="details-container p-3 pb-1 text-white">
                            {name}
                        </div>
                    </Link>
                </div>

                {users && users.length > 0 ? <div className="pb-2">
                    <small className="text-muted ms-3">Seen by: </small>
                    {userSet && userSet.slice(0, 3).map((user, index, array) => (
                        <span key={user}>
                            <small className="text-muted">
                                <Link to={`/profile/${user}`} className="text-muted text-decoration-none showcard-user">@{user}</Link>
                            </small>
                            {index < array.length - 1 && <small className="text-muted">, </small>}
                        </span>
                    ))}
                    <div className="p-3 d-flex justify-content-between">

                        <div role="button" onClick={toggleShowCompletedModal}>
                            <span className="material-icons me-1">add_task</span>
                        </div>
                        {showCompletedModal && !isLoading && (
                            <ShowModal closeModal={toggleShowCompletedModal} showName={name} showImg={image} series_id={series_id} seasons={seasons} users={users} status={"Completed"} />
                        )}

                        <div role="button" onClick={toggleShowWatchingModal}>
                            <span className="material-icons me-1">theaters</span>
                        </div>
                        {showWatchingModal && !isLoading && (
                            <ShowModal closeModal={toggleShowWatchingModal} showName={name} showImg={image} series_id={series_id} seasons={seasons} users={users} status={"Watching"} />
                        )}
                        <span role="button" className="material-icons me-1" onClick={toggleShowPlanningModal}>date_range</span>
                        {showPlanningModal && !isLoading && (
                            <ShowModal closeModal={toggleShowPlanningModal} showName={name} showImg={image} series_id={series_id} seasons={seasons} users={users} status={"Planning"} />
                        )}

                        <span role="button" className="material-icons me-1" onClick={toggleShowDroppedModal}>close</span>
                        {showDroppedModal && !isLoading && (
                            <ShowModal closeModal={toggleShowDroppedModal} showName={name} showImg={image} series_id={series_id} seasons={seasons} users={users} status={"Dropped"} />
                        )}

                    </div>
                </div> :
                    <div>
                        <br></br>
                        <div className="p-3 d-flex justify-content-between mt-1 mb-1">

                            <div role="button" onClick={toggleShowCompletedModal}>
                                <span className="material-icons me-1">add_task</span>
                            </div>
                            {showCompletedModal && !isLoading && (
                                <ShowModal closeModal={toggleShowCompletedModal} showName={name} showImg={image} series_id={series_id} seasons={seasons} users={users} status={"Completed"} />
                            )}

                            <div role="button" onClick={toggleShowWatchingModal}>
                                <span className="material-icons me-1">theaters</span>
                            </div>
                            {showWatchingModal && !isLoading && (
                                <ShowModal closeModal={toggleShowWatchingModal} showName={name} showImg={image} series_id={series_id} seasons={seasons} users={users} status={"Watching"} />
                            )}
                            <span role="button" className="material-icons me-1" onClick={toggleShowPlanningModal}>date_range</span>
                            {showPlanningModal && !isLoading && (
                                <ShowModal closeModal={toggleShowPlanningModal} showName={name} showImg={image} series_id={series_id} seasons={seasons} users={users} status={"Planning"} />
                            )}

                            <span role="button" className="material-icons me-1" onClick={toggleShowDroppedModal}>close</span>
                            {showDroppedModal && !isLoading && (
                                <ShowModal closeModal={toggleShowDroppedModal} showName={name} showImg={image} series_id={series_id} seasons={seasons} users={users} status={"Dropped"} />
                            )}

                        </div>
                    </div>}
            </div>

        </main>
    )
}

export default ShowCard;