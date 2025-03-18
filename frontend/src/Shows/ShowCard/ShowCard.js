import { useState, useEffect } from "react";
import axios from "axios";
import ShowModal from "./ShowModal";
import { Link } from "react-router-dom";
import AddToListButton from "../../Common/AddToListButton"
import { useScrollPosition } from "../../ScrollPositionContext";

function ShowCard({ name, image, series_id, users }) {
    const [seasons, setSeasons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userSet, setUserSet] = useState(null)
    const [showModal, setShowModal] = useState(false);
    const [show, setShow] = useState(null);
    const tmdbApiKey = process.env.REACT_APP_API_KEY;
    const apiUrl = process.env.REACT_APP_API_URL;

    const toggleModal = () => {setShowModal(!showModal)}

    const { scrollPosition, setScrollPosition } = useScrollPosition();

    useEffect(() => {
        if (scrollPosition !== undefined) {
            window.scrollTo(0, scrollPosition);
        }
    }, [scrollPosition]);

    useEffect(() => {
        return () => {
            setScrollPosition(window.scrollY);
            localStorage.setItem('scrollPosition', JSON.stringify(window.scrollY));
        };
    }, [setScrollPosition]);

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
                const seriesResponse = await axios.get(`https://api.themoviedb.org/3/tv/${series_id}?api_key=${process.env.REACT_APP_API_KEY}`);
                const totalSeasons = seriesResponse.data.number_of_seasons;

                let seasonsDetails = [];
                for (let i = 1; i <= totalSeasons; i++) {
                    const seasonResponse = await axios.get(`https://api.themoviedb.org/3/tv/${series_id}/season/${i}?api_key=${process.env.REACT_APP_API_KEY}`);
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

    async function fetchShowDetails(series_id) {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/tv/${series_id}?api_key=${tmdbApiKey}`
            );
            return response.data;
        } catch (error) {
            console.error(`Error fetching data for show ID ${series_id}:`, error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        async function updateShows() {
            const detailedShows = await fetchShowDetails(series_id);
            setShow(detailedShows);
        }

        updateShows();
    }, [series_id]);

    return (
        <main className="flex-shrink-0 col col-xl-3 col-lg-6 col-md-3 col-sm-6 col-6 show-card-size">
            <div className="bg-glass rounded-4 shadow-sm" >
                <div>
                    <Link to={`/shows/${series_id}`}>
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
                        <AddToListButton openModal={toggleModal} />
                        {!isLoading &&
                            showModal && (
                                <ShowModal
                                    closeModal={() => setShowModal(false)}
                                    showName={show.name}
                                    showImg={`https://image.tmdb.org/t/p/w500${show?.poster_path}`}
                                    series_id={show.id}
                                    seasons={seasons}
                                />
                            )}
                    </div>
                </div> :
                    <div>
                        <div className="p-3 d-flex justify-content-between mt-1 mb-1">
                            <AddToListButton openModal={toggleModal} />
                            {!isLoading &&
                            showModal && (
                                <ShowModal
                                    closeModal={() => setShowModal(false)}
                                    showName={show.name}
                                    showImg={`https://image.tmdb.org/t/p/w500${show?.poster_path}`}
                                    series_id={show.id}
                                    seasons={seasons}
                                />
                            )}
                        </div>
                    </div>}
            </div>

        </main>
    )
}

export default ShowCard;