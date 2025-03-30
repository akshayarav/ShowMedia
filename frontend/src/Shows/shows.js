import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import Sidebar from "../Sidebar/sidebar";
import ShowCard from "./ShowCard/ShowCard";
import ShowSearch from "./ShowSearchBar/ShowSearch";
import MobileBar from "../MobileBar/MobileBar";
import UserCard from "../SearchBar/UserCard";
import ShowList from "./ShowLists/ShowList";
import defaultImage from "./ShowCard/error.jpg";

function Shows() {
  const userId = localStorage.getItem("userId");

  const [shows, setShows] = useState([]);
  const [recShows, setRecShows] = useState(null);

  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedSearchTerm, setDisplayedSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchScreenOn, setSearchScreenOn] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  
  const apiUrl = process.env.REACT_APP_API_URL;
  const [selectedGenres, setSelectedGenres] = useState([]);

  // Function to actually perform the search
  const performSearch = useCallback((query) => {
    if (!query.trim()) {
      setShows([]);
      setDisplayedSearchTerm("");
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setDisplayedSearchTerm(query);

    axios
      .get(`https://api.themoviedb.org/3/search/tv?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&query=${query}`)
      .then((response) => {
        const searchedShows = response.data.results.map((show) => {
          return {
            id: show.id,
            name: show.name,
            image: show.poster_path
              ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
              : defaultImage,
            series_id: show.id,
            genre_ids: show.genre_ids,
            users: recShows && recShows.has(show.id.toString())
              ? recShows.get(show.id.toString()).users
              : [],
          };
        });
        setShows(searchedShows);
        setIsSearching(false);
      })
      .catch((error) => {
        console.error("Error searching: ", error);
        setIsSearching(false);
      });
  }, [recShows]);

  // Create a debounced version of the search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((term) => {
      performSearch(term);
    }, 500), // 1.2 seconds delay - very noticeable for testing
    [performSearch]
  );

  // Handle search term changes
  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
    debouncedSearch(term);
  }, [debouncedSearch]);

  const addGenre = (genreId) => {
    setSelectedGenres((prevSelectedGenres) => {
      if (prevSelectedGenres.includes(genreId)) {
        return prevSelectedGenres.filter((id) => id !== genreId);
      } else {
        return [...prevSelectedGenres, genreId];
      }
    });
  };

  useEffect(() => {
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
      });
  }, [apiUrl, userId]);

  // Cleanup the debounce function when component unmounts
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

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

  if (searchTerm) {
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
              <div className="col col-xl-9 order-lg-2 col-lg-12 col-md-12 col-sm-12 border-start">
                <ShowSearch
                  onSearch={handleSearchChange}
                  addGenre={addGenre}
                  selectedGenres={selectedGenres}
                  initialSearchTerm={searchTerm}
                />
                
                {isSearching ? (
                  <div className="d-flex justify-content-center my-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="ms-3">Searching for "{displayedSearchTerm}"...</span>
                  </div>
                ) : (
                  <div className="row">
                    {displayedSearchTerm && (
                      <div className="col-12 mb-3">
                        <h4>Search results for: "{displayedSearchTerm}"</h4>
                      </div>
                    )}
                    {shows
                      .filter((show) => {
                        return (
                          selectedGenres.length === 0 ||
                          show.genre_ids.some((genreId) =>
                            selectedGenres.includes(genreId)
                          )
                        );
                      })
                      .map((show, index) => (
                        <ShowCard
                          key={index}
                          series_id={show.id}
                          name={show.name}
                          image={show.image}
                          users={show.users}
                        />
                      ))}
                      
                    {!isSearching && shows.length === 0 && displayedSearchTerm && (
                      <div className="col-12 text-center my-5">
                        <h5>No shows found matching "{displayedSearchTerm}"</h5>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <Sidebar
                isOffcanvasOpen={isOffcanvasOpen}
                toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)}
              />
            </div>
          </div>
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
            <div className="col col-xl-9 order-lg-2 col-lg-12 col-md-12 col-sm-12 border-start">
              <ShowSearch
                onSearch={handleSearchChange}
                addGenre={addGenre}
                selectedGenres={selectedGenres}
              />
              <ShowList recShows={recShows} selectedGenres={selectedGenres} />
            </div>
            <Sidebar
              isOffcanvasOpen={isOffcanvasOpen}
              toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shows;