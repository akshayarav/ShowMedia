import React, { useState, useEffect } from "react";
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
  const [searchScreenOn, setSearchScreenOn] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const searchApiUrl = (query) =>
    `https://api.themoviedb.org/3/search/tv?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&query=${query}`;

  const apiUrl = process.env.REACT_APP_API_URL;

  const [selectedGenres, setSelectedGenres] = useState([]);

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
      });
  }, [apiUrl, userId]);

  const handleSearch = (query) => {
    axios
      .get(searchApiUrl(query))
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
            users: recShows.has(show.id.toString())
              ? recShows.get(show.id.toString()).users
              : [],
          };
        });
        setShows(searchedShows);
      })
      .catch((error) => {
        console.error("Error searching: ", error);
      });
  };

  const debounceSearch = debounce(handleSearch, 500);

  useEffect(() => {
    if (searchTerm) {
      debounceSearch(searchTerm);
    }
  }, [searchTerm, debounceSearch]);

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
                  onSearch={setSearchTerm}
                  addGenre={addGenre}
                  selectedGenres={selectedGenres}
                />
                <div className="row">
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
                </div>
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
                onSearch={setSearchTerm}
                addGenre={addGenre}
                selectedGenres={selectedGenres}
              />
              <ShowList recShows = {recShows} selectedGenres = {selectedGenres} />
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
