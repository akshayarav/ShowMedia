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

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal)

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/following/shows/${userId}`)
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
    if (recShows) {
      show.users = recShows.has(show.id.toString())
        ? recShows.get(show.id.toString()).users
        : [];
    }
  }, [recShows]);

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
                <h2 className="fw-bold text-white mb-1">{show?.name}</h2>
                <div className="container mt-3">
                  <div className="row bg-glass p-3 feed-item rounded-4 shadow-sm z-top">
                    <div className="col-3">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${show?.poster_path}`}
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                      <div className="d-flex mb-3 mt-3 justify-content-center">
                        <AddToListButton show={show} openModal = {toggleModal}/>
                      </div>
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
                    <div
                      className="py-3 px-lg-3 col-9 d-flex flex-column overflow-auto"
                      style={{ maxHeight: "345px", gap: "10px" }}
                    >
                      <div className="bg-glass rounded-4 p-3">
                        <h6 className="fw-bold text-body text-center border-bottom pb-2">
                          {" "}
                          Overview
                        </h6>
                        <div>{show?.overview}</div>
                      </div>

                      <div className="d-flex flex-column bg-glass rounded-4 p-3">
                        <h6 className="fw-bold text-body text-center border-bottom pb-2">
                          {" "}
                          Show Information
                        </h6>
                        <div
                          className="d-flex justify-content-center overflow-auto"
                          style={{ gap: "10px" }}
                        >
                          <div className="d-flex bg-brown-gradient-color rounded-4 flex-column p-3">
                            <h6 className="fw-bold text-primary text-center mt-2">
                              Status
                            </h6>
                            <div className="text-center"> {show?.status}</div>
                          </div>
                          <div className="d-flex bg-brown-gradient-color rounded-4 flex-column p-3">
                            <h6 className="fw-bold text-primary text-center mt-2">
                              First Air Date
                            </h6>
                            <div className="text-center">
                              {" "}
                              {show?.first_air_date}
                            </div>
                          </div>
                          <div className="d-flex bg-brown-gradient-color rounded-4 flex-column p-3">
                            <h6 className="fw-bold text-primary text-center mt-2">
                              Genre
                            </h6>
                            <div className="text-center">
                              {show?.genres
                                ?.map((genre) => genre.name)
                                .join(", ")}
                            </div>
                          </div>
                          <div className="d-flex bg-brown-gradient-color rounded-4 flex-column p-3">
                            <h6 className="fw-bold text-primary text-center mt-2">
                              Origin Country
                            </h6>
                            <div className="text-center">
                              {" "}
                              {show?.origin_country
                                ?.map((country) => country)
                                .join(", ")}
                            </div>
                          </div>
                          <div className="d-flex bg-brown-gradient-color rounded-4 flex-column p-3">
                            <h6 className="fw-bold text-primary text-center mt-2">
                              Original Language
                            </h6>
                            <div className="text-center">
                              {" "}
                              {show?.original_language}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex flex-column bg-glass rounded-4 p-3 justify-content-center">
                        <h6 className="fw-bold text-body text-center border-bottom pb-2">
                          {" "}
                          Show Statistics
                        </h6>
                        <div
                          className="d-flex justify-content-center overflow-auto"
                          style={{ gap: "10px" }}
                        >
                          <div className="d-flex bg-brown-gradient-color rounded-4 flex-column p-3">
                            <h6 className="fw-bold text-primary text-center mt-2">
                              Vote Average
                            </h6>
                            <div className="text-center"> {show?.vote_average}</div>
                          </div>
                          <div className="d-flex bg-brown-gradient-color rounded-4 flex-column p-3">
                            <h6 className="fw-bold text-primary text-center mt-2">
                              Vote Count
                            </h6>
                            <div className="text-center"> {show?.vote_count}</div>
                          </div>
                          <div className="d-flex bg-brown-gradient-color rounded-4 flex-column p-3">
                            <h6 className="fw-bold text-primary text-center mt-2">
                              Number of Episodes
                            </h6>
                            <div className="text-center">
                              {" "}
                              {show?.number_of_episodes}
                            </div>
                          </div>
                          <div className="d-flex bg-brown-gradient-color rounded-4 flex-column p-3">
                            <h6 className="fw-bold text-primary text-center mt-2">
                              Number of Seasons
                            </h6>
                            <div className="text-center">
                              {" "}
                              {show?.number_of_seasons}
                            </div>
                          </div>
                          <div className="d-flex bg-brown-gradient-color rounded-4 flex-column p-3">
                            <h6 className="fw-bold text-primary text-center mt-2">
                              Popularity
                            </h6>
                            <div className="text-center">
                              {" "}
                              {show?.popularity}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row border-top mt-3">
                    <div className="d-flex p-3">
                      <div
                        style={{
                          width: "50%",
                          marginRight: "10px",
                          maxWidth: "50vw",
                        }}
                      >
                        <div className="bg-glass rounded-4 flex-grow-1">
                          <h5 className="fw-bold text-body p-3 mb-0 d-flex justify-content-center">
                            Created By
                          </h5>
                          <div className="d-flex overflow-auto justify-content-center">
                            {show &&
                              show.created_by &&
                              show.created_by.length > 0 ? (
                              show.created_by.map((creator) => (
                                <div className="d-flex ms-3 mb-3 me-3 justify-content-between">
                                  <img
                                    style={{ width: "80px", height: "80px" }}
                                    className="rounded-circle me-2 ms-1"
                                    src={
                                      creator.profile_path
                                        ? `https://image.tmdb.org/t/p/w92/${creator.profile_path}`
                                        : "/default_profile.jpg"
                                    }
                                    alt={creator.name}
                                  />
                                  <div className="d-flex flex-column fw-bold text-center justify-content-center me-2">
                                    {creator.name}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="fw-bold text-body p-3">
                                No creator information
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          width: "50%",
                          marginLeft: "10px",
                          maxWidth: "50vw",
                        }}
                      >
                        <div className="bg-glass rounded-4 flex-grow-1">
                          <h5 className="fw-bold text-body p-3 mb-0 d-flex justify-content-center">
                            Networks
                          </h5>
                          <div className="d-flex justify-content-center overflow-auto">
                            {show &&
                              show.networks &&
                              show.networks.length > 0 ? (
                              show.networks.map((network) => (
                                <div className="ms-3 mb-3 me-3 d-flex justify-content-between">
                                  <img
                                    style={{ width: "80px", height: "80px" }}
                                    className="rounded-circle me-2 ms-1"
                                    src={
                                      network.logo_path
                                        ? `https://image.tmdb.org/t/p/w92/${network.logo_path}`
                                        : "/error.jpg"
                                    }
                                    alt={network.name}
                                  />
                                  <div className="d-flex flex-column fw-bold text-center justify-content-center me-2">
                                    {network.name}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="fw-bold text-body p-3">
                                No network information
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                              No one has watched this show yet, be the first!
                            </div>
                          </div>
                        )}
                        {show &&
                          show.users &&
                          show.seasons &&
                          show.users.map((user) => (
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
