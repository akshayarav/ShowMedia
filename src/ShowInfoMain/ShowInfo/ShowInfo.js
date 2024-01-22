import { useParams } from "react-router-dom";
import Sidebar from "../../Sidebar/sidebar";
import axios from "axios";
import { useEffect, useState } from "react";
import MobileBar from "../../MobileBar/MobileBar";
import UserCard from "../../SearchBar/UserCard";
import { Button } from "react-bootstrap";
import ShowModal from "../../Shows/ShowCard/ShowModal";

function ShowInfo() {
    const { showId } = useParams();
    const apiUrl = process.env.REACT_APP_API_URL;
    const userId = localStorage.getItem('userId')
    const [show, setShow] = useState(null)
    const tmdbApiKey = process.env.REACT_APP_API_KEY

    const [searchScreenOn, setSearchScreenOn] = useState(false)
    const [searchResults, setSearchResults] = useState([]);
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

    const [recShows, setRecShows] = useState(null)
    const [seasons, setSeasons] = useState(null)

    const [showCompletedModal, setShowCompletedModal] = useState(false);
    const [showWatchingModal, setShowWatchingModal] = useState(false);
    const [showPlanningModal, setShowPlanningModal] = useState(false);
    const [showDroppedModal, setShowDroppedModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const toggleShowCompletedModal = () => setShowCompletedModal(!showCompletedModal);
    const toggleShowWatchingModal = () => setShowWatchingModal(!showWatchingModal);
    const toggleShowPlanningModal = () => setShowPlanningModal(!showPlanningModal);
    const toggleShowDroppedModal = () => setShowDroppedModal(!showDroppedModal);



    useEffect(() => {
        axios.get(`${apiUrl}/api/following/shows/${userId}`)
            .then(response => {
                let dataMap = new Map(response.data.map(item => {
                    let id = item[0];
                    let associatedObject = item[1];

                    return [id, associatedObject];
                }));
                setRecShows(dataMap);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            }).finally(e => {
                setIsLoading(false)
            });
    }, [apiUrl, userId]);

    useEffect(() => {
        if (recShows) {
            show.users = recShows.has(show.id.toString()) ? recShows.get(show.id.toString()).users : []
        }
    }, [recShows]);

    async function fetchShowDetails(showId) {
        setIsLoading(true);
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/tv/${showId}?api_key=${tmdbApiKey}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching data for show ID ${showId}:`, error);
            return null;
        } finally {
            setIsLoading(false); // End loading
        }

    }

    useEffect(() => {
        async function updateShows() {
            const detailedShows = await fetchShowDetails(showId);
            setShow((detailedShows));
        }

        updateShows();
    }, [showId]);

    useEffect(() => {
        const fetchSeasons = async () => {
            try {
                setIsLoading(true);
                const seriesResponse = await axios.get(`https://api.themoviedb.org/3/tv/${show.id}?api_key=${process.env.REACT_APP_API_KEY}`);
                const totalSeasons = seriesResponse.data.number_of_seasons;

                let seasonsDetails = [];
                for (let i = 1; i <= totalSeasons; i++) {
                    const seasonResponse = await axios.get(`https://api.themoviedb.org/3/tv/${show.id}/season/${i}?api_key=${process.env.REACT_APP_API_KEY}`);
                    seasonsDetails.push(seasonResponse.data);
                }
                setSeasons(seasonsDetails);
            } catch (error) {
                console.error('Error fetching season details: ', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (show) {fetchSeasons()};
    }, [show]);

    if (searchScreenOn) {
        return (<div>
            <MobileBar toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} toggleSearchScreen={(e) => setSearchScreenOn(e)} setSearchResults={(e) => setSearchResults(e)} />
            <div className="bg-glass rounded-4 overflow-hidden shadow-sm account-follow mb-4">
                {searchResults.map(user => (
                    <UserCard key={user._id} other_user={user} />
                ))}
            </div>
        </div>)
    }


    return (
        <div className="bg-brown-gradient">
            <MobileBar toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} toggleSearchScreen={(e) => setSearchScreenOn(e)} setSearchResults={(e) => setSearchResults(e)} />
            <div className="py-4">
                <div className="container">
                    <div className="row position-relative">
                        <div className="col">
                            <div className="main-content">
                                <h2 className="fw-bold text-white mb-1">{show?.name}</h2>
                                <div className="pb-4 m-none">
                                    <div
                                        className="rounded-4"
                                        style={{
                                            backgroundImage: `url(https://image.tmdb.org/t/p/w500${show?.backdrop_path})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat',
                                            width: '100%',
                                            height: '400px'
                                        }}
                                    />
                                </div>

                                <div className="container mt-3">
                                    <div className="row bg-glass p-3 feed-item rounded-4 shadow-sm z-top">
                                        <div className="col-3">
                                            <img src={`https://image.tmdb.org/t/p/w500${show?.poster_path}`}
                                                style={{ maxWidth: '100%', height: 'auto' }} />
                                            <div className="d-flex mb-3 mt-3 justify-content-center">
                                                <div className="dropdown flex-grow-1">
                                                    <Button variant="primary" type="submit" className="btn btn-primary" style={{ width: '100%', height: 'auto' }} data-bs-toggle="dropdown" aria-expanded="false">
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            Add to List
                                                            <span className="material-icons md-20">expand_more</span>
                                                        </div>
                                                    </Button>
                                                    <ul className="dropdown-menu fs-13 dropdown-menu-end" aria-labelledby="dropdownMenuButton7" style={{ position: 'relative', zIndex: 1000 }}>
                                                        <li>
                                                            <button onClick={toggleShowCompletedModal} className="dropdown-item text-muted z-top" htmlFor="btncheck1">
                                                                <span className="material-icons md-13 me-1">add_task</span>
                                                                Completed
                                                            </button>
                                                            {!isLoading && show && Array.isArray(show.users) && showCompletedModal && (
                                                                <ShowModal closeModal={toggleShowCompletedModal} showName={show.name} showImg={`https://image.tmdb.org/t/p/w500${show?.poster_path}`} series_id={show.id} seasons={seasons} users={show.users} status={"Completed"} />
                                                            )}
                                                        </li>
                                                        <li>
                                                            <button onClick={toggleShowWatchingModal} className="dropdown-item text-muted z-top" htmlFor="btncheck2">
                                                                <span className="material-icons md-13 me-1">theaters</span>
                                                                Watching
                                                            </button>
                                                            {!isLoading && show && Array.isArray(show.users) && showWatchingModal && (
                                                                <ShowModal closeModal={toggleShowWatchingModal} showName={show.name} showImg={`https://image.tmdb.org/t/p/w500${show?.poster_path}`} series_id={show.id} seasons={seasons} users={show.users} status={"Watching"} />
                                                            )}
                                                        </li>
                                                        <li>
                                                            <button onClick={toggleShowPlanningModal} className="dropdown-item text-muted z-top" htmlFor="btncheck2">
                                                                <span className="material-icons md-13 me-1">date_range</span>
                                                                Planning
                                                            </button>
                                                            {!isLoading && show && Array.isArray(show.users) && showPlanningModal && (
                                                                <ShowModal closeModal={toggleShowPlanningModal} showName={show.name} showImg={`https://image.tmdb.org/t/p/w500${show?.poster_path}`} series_id={show.id} seasons={seasons} users={show.users} status={"Planning"} />
                                                            )}
                                                        </li>
                                                        <li>
                                                            <button onClick={toggleShowDroppedModal} className="dropdown-item text-muted z-top" htmlFor="btncheck2">
                                                                <span className="material-icons md-13 me-1">theaters</span>
                                                                Dropped
                                                            </button>
                                                            {!isLoading && show && Array.isArray(show.users) && showDroppedModal && (
                                                                <ShowModal closeModal={toggleShowDroppedModal} showName={show.name} showImg={`https://image.tmdb.org/t/p/w500${show?.poster_path}`} series_id={show.id} seasons={seasons} users={show.users} status={"Dropped"} />
                                                            )}
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="py-3 px-lg-3 col-9 d-flex flex-column justify-content-between">
                                            <div>{show?.overview}</div>
                                            <div>
                                                <h6 className="fw-bold text-body" >Status: {show?.status}</h6>
                                                <a className="align-self: flex-end" href={show?.homepage} target="_blank" rel="noopener noreferrer">{show?.homepage}</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row border-top mt-3" >
                                        <div className="p-3">
                                            <div className="bg-glass rounded-4 overflow-hidden shadow-sm">
                                                <h5 className="fw-bold text-body p-3 mb-0 d-flex justify-content-center">Created By</h5>
                                                <div className="d-flex justify-content-center">
                                                    {show && show.created_by && show.created_by.map(creator =>
                                                        <div className="bg-glass rounded-4 overflow-hidden shadow-sm account-follow ms-3 mb-3 me-3 d-flex">
                                                            <img style={{ width: '80px', height: '80px' }} className="img-fluid rounded-circle" src={creator.profile_path ? `https://image.tmdb.org/t/p/w92/${creator.profile_path}` : "/default_profile.jpg"} alt={creator.name} />
                                                            <h6 className="fw-bold text-body p-3 mb-0">{creator.name} </h6>
                                                        </div>)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row border-top mt-3" >
                                        <div className="p-3">
                                            <div className="bg-glass rounded-4 overflow-hidden shadow-sm">
                                                <h5 className="fw-bold text-body p-3 mb-0 d-flex justify-content-center">Networks</h5>
                                                <div className="d-flex justify-content-center">
                                                    {show && show.networks && show.networks.map(network =>
                                                        <div className=" ms-3 mb-3 me-3 d-flex">
                                                            <img style={{ width: '80px', height: '80px' }} className="img-fluid rounded-circle" src={network.logo_path ? `https://image.tmdb.org/t/p/w92/${network.logo_path}` : "/default_profile.jpg"} alt={network.name} />
                                                        </div>)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row border-top mt-3" >
                                        <div className="p-3 scrollable-div" >
                                            <div className="bg-glass rounded-4 overflow-hidden shadow-sm account-follow mb-4">
                                                {show && show.users && show.users.length > 0 &&
                                                    <h6 className="fw-bold text-body p-3 mb-0 border-bottom">Seen By</h6>}
                                                {show && show.users && show.seasons && show.users.map(user => <small key={user}><UserCard username={user} /></small>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ShowInfo