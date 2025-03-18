import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import MobileBar from "../../MobileBar/MobileBar";
import UserCard from "../../SearchBar/UserCard";
import AddToListButton from "../../Common/AddToListButton"
import ShowModal from "../../Shows/ShowCard/ShowModal";

function ShowInfo() {
  const { showId } = useParams();
  const apiUrl = process.env.REACT_APP_API_URL;
  const userId = localStorage.getItem("userId");
  const [show, setShow] = useState(null);
  const tmdbApiKey = process.env.REACT_APP_API_KEY;

  const [searchScreenOn, setSearchScreenOn] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

  const [recShows, setRecShows] = useState(null);
  const [seasons, setSeasons] = useState(null);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal)

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get(`${apiUrl}/api/user/following/shows/${userId}`)
      .then((response) => {
        let dataMap = new Map(
          response.data.map((item) => {
            let id = item[0];
            let associatedObject = item[1];

            return [id, associatedObject];
          })
        );
        setRecShows(dataMap);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      })
      .finally((e) => {
        setIsLoading(false);
      });
  }, [apiUrl, userId]);

  useEffect(() => {
    if (recShows && show) {
      show.users = recShows.has(show.id.toString())
        ? recShows.get(show.id.toString()).users
        : [];
    }
  }, [recShows, show]);

  async function fetchShowDetails(showId) {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/tv/${showId}?api_key=${tmdbApiKey}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching data for show ID ${showId}:`, error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function updateShows() {
      const detailedShows = await fetchShowDetails(showId);
      setShow(detailedShows);
    }

    updateShows();
  }, [showId]);

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        setIsLoading(true);
        const seriesResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${show.id}?api_key=${process.env.REACT_APP_API_KEY}`
        );
        const totalSeasons = seriesResponse.data.number_of_seasons;

        let seasonsDetails = [];
        for (let i = 1; i <= totalSeasons; i++) {
          const seasonResponse = await axios.get(
            `https://api.themoviedb.org/3/tv/${show.id}/season/${i}?api_key=${process.env.REACT_APP_API_KEY}`
          );
          seasonsDetails.push(seasonResponse.data);
        }
        setSeasons(seasonsDetails);
      } catch (error) {
        console.error("Error fetching season details: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (show) {
      fetchSeasons();
    }
  }, [show]);

  if (searchScreenOn) {
    return (
      <div>
        <MobileBar
          toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)}
          toggleSearchScreen={(e) => setSearchScreenOn(e)}
          setSearchResults={(e) => setSearchResults(e)}
        />
        <div className="bg-glass rounded-4 overflow-hidden shadow-sm account-follow mb-4">
          {searchResults.map((user) => (
            <UserCard key={user._id} other_user={user} />
          ))}
        </div>
      </div>
    );
  }

  function removeDuplicates(array) {
    return [...new Set(array)];
  }

  return (
    <div className="bg-brown-gradient">
      <MobileBar
        toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)}
        toggleSearchScreen={(e) => setSearchScreenOn(e)}
        setSearchResults={(e) => setSearchResults(e)}
      />
      <div className="py-4">
        <div className="container">
          <div className="row position-relative">
            <div className="col">
              <div className="main-content">
                <h2 className="fw-bold text-primary mb-1">{show?.name}</h2>
                <div className="container mt-3">
                  <div className="rounded-4 mb-4">
                    <div>{show?.overview}</div>
                  </div>
                  <div className="row bg-glass p-3 feed-item rounded-4 shadow-sm z-top">
                    {/* Modified layout for better responsive behavior */}
                    <div className="col-md-3 col-sm-12 mb-3 mb-md-0">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${show?.poster_path}`}
                        className="img-fluid mx-auto d-block"
                        alt={show?.name}
                      />
                      <div className="d-flex mb-3 mt-3 justify-content-center">
                        <AddToListButton show={show} openModal={toggleModal} />
                      </div>
                      {!isLoading &&
                        showModal && (
                          <ShowModal
                            closeModal={() => setShowModal(false)}
                            showName={show?.name}
                            showImg={`https://image.tmdb.org/t/p/w500${show?.poster_path}`}
                            series_id={show?.id}
                            seasons={seasons}
                          />
                        )}
                    </div>
                    <div className="py-3 px-lg-3 col-md-9 col-sm-12 d-flex flex-column">
                      <div className="container">
                        <div className="row">
                          <h6 className="fw-bold text-body text-center border-bottom pb-2">
                            Show Information
                          </h6>
                        </div>

                        {/* First row of info - responsive grid */}
                        <div className="row d-flex justify-content-center border-bottom p-2">
                          <div className="bg-brown-gradient-color rounded-4 col-6 col-md-2 p-2 p-md-3 m-1">
                            <h6 className="fw-bold text-primary text-center mt-2 fs-6">
                              Status
                            </h6>
                            <div className="text-center small">{show?.status}</div>
                          </div>
                          <div className="bg-brown-gradient-color rounded-4 p-2 p-md-3 col-10 col-md-6 m-1">
                            <h6 className="fw-bold text-primary text-center mt-2 fs-6">
                              Genres
                            </h6>
                            <div className="text-center small">
                              {show?.genres
                                ?.map((genre) => genre.name)
                                .join(", ")}
                            </div>
                          </div>
                          <div className="bg-brown-gradient-color rounded-4 p-2 p-md-3 col-6 col-md-2 m-1">
                            <h6 className="fw-bold text-primary text-center mt-2 fs-6">
                              First Air
                            </h6>
                            <div className="text-center small">
                              {show?.first_air_date ? formatDate(show.first_air_date) : 'N/A'}
                            </div>
                          </div>
                        </div>

                        {/* Second row of info - responsive grid with smaller cards */}
                        <div className="row d-flex justify-content-center border-bottom p-2">
                          <div className="bg-brown-gradient-color rounded-4 p-2 p-md-3 col-5 col-md-2 m-1">
                            <h6 className="fw-bold text-primary text-center mt-2 fs-6">
                              Rating
                            </h6>
                            <div className="text-center small">{show?.vote_average}</div>
                          </div>
                          <div className="bg-brown-gradient-color rounded-4 col-5 col-md-2 p-2 p-md-3 m-1">
                            <h6 className="fw-bold text-primary text-center mt-2 fs-6">
                              Votes
                            </h6>
                            <div className="text-center small">{show?.vote_count}</div>
                          </div>
                          <div className="bg-brown-gradient-color rounded-4 col-5 col-md-2 p-2 p-md-3 m-1">
                            <h6 className="fw-bold text-primary text-center mt-2 fs-6">
                              Episodes
                            </h6>
                            <div className="text-center small">
                              {show?.number_of_episodes}
                            </div>
                          </div>
                          <div className="bg-brown-gradient-color rounded-4 col-5 col-md-2 p-2 p-md-3 m-1">
                            <h6 className="fw-bold text-primary text-center mt-2 fs-6">
                              Seasons
                            </h6>
                            <div className="text-center small">
                              {show?.number_of_seasons}
                            </div>
                          </div>
                          <div className="bg-brown-gradient-color rounded-4 col-5 col-md-2 p-2 p-md-3 m-1">
                            <h6 className="fw-bold text-primary text-center mt-2 fs-6">
                              Popularity
                            </h6>
                            <div className="text-center small">
                              {show?.popularity}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Created By section */}
                  {show && show.created_by && show.created_by.length > 0 && (
                    <div className="row border-top mt-3">
                      <div className="d-flex p-3 flex-grow-1">
                        <div className="bg-glass rounded-4 flex-grow-1">
                          <h5 className="fw-bold text-body p-3 mb-0 d-flex justify-content-center">
                            Created By
                          </h5>
                          <div className="d-flex flex-wrap overflow-auto justify-content-center">
                            {show.created_by.map((creator, index) => (
                              <div key={index} className="d-flex fw-bold text-center text-primary justify-content-center me-2">
                                <p>{creator.name}</p>
                                {index !== show.created_by.length - 1 && (
                                  <span className="material-icons md-10 m-1 text-white">circle</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Seen By section */}
                  <div className="row border-top mt-3">
                    <div className="p-3 scrollable-div">
                      <div className="bg-glass rounded-4 overflow-hidden shadow-sm account-follow mb-4">
                        {show && show.users && show.users.length > 0 ? (
                          <h6 className="fw-bold text-body p-3 mb-0 d-flex justify-content-center">
                            Seen By
                          </h6>
                        ) : (
                          <div className="d-flex flex-column mb-0 d-flex justify-content-center">
                            <h6 className="fw-bold text-body mt-3 mb-0 d-flex justify-content-center">
                              Seen By
                            </h6>
                            <div className="text-center mt-2 mb-3">
                              No one you follow has watched this show yet, be the first!
                            </div>
                          </div>
                        )}
                        {show &&
                          show.users &&
                          show.seasons &&
                          removeDuplicates(show.users).map((user) => (
                            <small key={user}>
                              <UserCard username={user} />
                            </small>
                          ))}
                      </div>
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

export default ShowInfo;