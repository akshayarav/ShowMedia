import { useParams } from "react-router-dom";
import Sidebar from "../Sidebar/sidebar";
import axios from "axios";
import { useEffect, useState } from "react";
import MobileBar from "../MobileBar/MobileBar";
import UserCard from "../SearchBar/UserCard";
import { Button } from "react-bootstrap";
import ShowModal from "../Shows/ShowCard/ShowModal";

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

        fetchSeasons();
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

    console.log(show)

    return (
        <div className="bg-brown-gradient">
            <MobileBar toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} toggleSearchScreen={(e) => setSearchScreenOn(e)} setSearchResults={(e) => setSearchResults(e)} />
            <div className="py-4">
                <div className="container">
                    <div className="row position-relative">
                        <div className="col col-xl-9 order-lg-2 col-lg-12 col-md-12 col-sm-12 border-start">
                            <div className="main-content">
                                <a href="/shows" class="material-icons text-white text-decoration-none mb-4 me-5">arrow_back</a>
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
                                    <div className="row bg-glass p-3 feed-item rounded-4 shadow-sm">
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
                                                    <ul className="dropdown-menu fs-13 dropdown-menu-end" aria-labelledby="dropdownMenuButton7">
                                                        <li>
                                                            <button onClick={toggleShowCompletedModal} className="dropdown-item text-muted" htmlFor="btncheck1">
                                                                <span className="material-icons md-13 me-1">add_task</span>
                                                                Completed
                                                            </button>
                                                            {!isLoading && show && Array.isArray(show.users) && showCompletedModal && (
                                                                <ShowModal closeModal={toggleShowCompletedModal} showName={show.name} showImg={`https://image.tmdb.org/t/p/w500${show?.poster_path}`} series_id={show.id} seasons={seasons} users={show.users} status={"Completed"} />
                                                            )}
                                                        </li>

                                                    </ul>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="py-3 px-lg-3 col-9">
                                            {show?.overview}
                                        </div>
                                    </div>
                                    <div className="row border-top mt-3">
                                        <div className="p-3 scrollable-div">
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
                        <Sidebar isOffcanvasOpen={isOffcanvasOpen} toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ShowInfo