import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import debounce from 'lodash.debounce';
import Sidebar from "../Sidebar/sidebar";
import ShowCard from "./ShowCard/ShowCard";
import ShowSearch from './ShowSearch';
import MobileBar from '../MobileBar/MobileBar';
import defaultImage from './ShowCard/error.jpg';
import SearchBar from "../SearchBar/SearchBar"

function Shows() {
    const [shows, setShows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const popularApiUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=${currentPage}`;
    const searchApiUrl = query => `https://api.themoviedb.org/3/search/tv?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&query=${query}`;

    useEffect(() => {
        Axios.get(popularApiUrl)
            .then(response => {
                const newShows = response.data.results.map(show => ({
                    id: show.id,
                    name: show.name,
                    image: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : defaultImage,
                    series_id: show.id
                }));
                setShows(prevShows => [...prevShows, ...newShows]);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }, [currentPage]);

    useEffect(() => {
        if (searchTerm) {
            debounceSearch(searchTerm);
        } else {
            setCurrentPage(1);
            setShows([]);
            Axios.get(popularApiUrl)
                .then(response => {
                    const fetchedShows = response.data.results.map(show => ({
                        id: show.id,
                        name: show.name,
                        image: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : defaultImage,
                        series_id: show.id
                    }));
                    setShows(fetchedShows);
                })
                .catch(error => {
                    console.error('Error fetching data: ', error);
                });
        }
    }, [searchTerm]);

    const handleSearch = query => {
        Axios.get(searchApiUrl(query))
            .then(response => {
                const searchedShows = response.data.results.map(show => ({
                    id: show.id,
                    name: show.name,
                    image: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : defaultImage,
                    series_id: show.id
                }));
                setShows(searchedShows);
            })
            .catch(error => {
                console.error('Error searching: ', error);
            });
    };

    const debounceSearch = debounce(handleSearch, 500);

    const handleShowMore = (event) => {
        event.preventDefault();
        setCurrentPage(prevPage => prevPage + 1);
    };

    return (
        <div className="bg-light">
            <MobileBar toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} />
            <div className="py-4">
                <div className="container">
                    <div className="row position-relative">
                        <div className="col col-xl-6 order-lg-2 col-lg-8 col-md-8 col-sm-8">
                            <ShowSearch onSearch={setSearchTerm} />
                                <h2 class="fw-bold text-black mb-1">Popular Shows</h2>
                            <div className="row">
                                {shows.map((show, index) => (
                                    <ShowCard key={index} series_id={show.id} name={show.name} image={show.image} />
                                ))}
                            </div>
                            {searchTerm === '' && (
                                <a onClick={handleShowMore} className="text-decoration-none">
                                    <div className="p-3">Show More</div>
                                </a>
                            )}
                        </div>
                        <SearchBar />
                        <Sidebar isOffcanvasOpen={isOffcanvasOpen} toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Shows;