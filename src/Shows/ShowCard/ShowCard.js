import { useState, useEffect } from "react";
import Axios from "axios";
import ShowModal from "./ShowModal";
import { Link } from "react-router-dom";

function ShowCard({ name, image, series_id, users }) {
    const [showModal, setShowModal] = useState(false);
    const [seasons, setSeasons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userSet, setUserSet] = useState(null)

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

    const toggleShowModal = () => {
        setShowModal(!showModal);
    };


    return (
        <main className="flex-shrink-0 col col-xl-3 col-lg-6 col-md-3 col-sm-6 col-6 show-card-size">
            <div className="bg-glass rounded-4 shadow-sm" >
                <div
                    role="button"
                    tabIndex="0"
                    onClick={toggleShowModal}
                >
                    <div className="image-container">
                        <img src={image} className="img-fluid rounded-top" alt={name} />
                    </div>
                    <div className="details-container p-3 pb-1 text-white">
                        {name}
                    </div>
                </div>
                {showModal && !isLoading && <ShowModal closeModal={toggleShowModal} showName={name} showImg={image} series_id={series_id} seasons={seasons} />}


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
                </div> : <div className="p-3"> </div>}
            </div>
        </main>
    )
}

export default ShowCard;