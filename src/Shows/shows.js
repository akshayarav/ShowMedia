import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import debounce from 'lodash.debounce';
import Sidebar from "../Sidebar/sidebar";
import ShowCard from "./ShowCard/ShowCard";
import SearchBar from './SearchBar';

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
                const fetchedShows = response.data.results.map(show => ({
                    id: show.id,
                    name: show.name,
                    image: `https://image.tmdb.org/t/p/w500${show.poster_path}`
                }));
                setShows(fetchedShows);
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
            Axios.get(popularApiUrl)
                .then(response => {
                    const fetchedShows = response.data.results.map(show => ({
                        id: show.id,
                        name: show.name,
                        image: `https://image.tmdb.org/t/p/w500${show.poster_path}`
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
                    image: `https://image.tmdb.org/t/p/w500${show.poster_path}`
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
        <body className="bg-light">
            <div className="web-none d-flex align-items-center px-3 pt-3">
                <a href="index.html" className="text-decoration-none">
                    <img src="img/logo.png" className="img-fluid logo-mobile" alt="brand-logo" />
                </a>
                <button className="ms-auto btn btn-primary ln-0" type="button" onClick={() => setIsOffcanvasOpen(!isOffcanvasOpen)}>
                    <span className="material-icons">menu</span>
                </button>
            </div>
            <div className="py-4">
                <div className="container">
                    <SearchBar onSearch={setSearchTerm} />
                    <div className="row position-relative">
                        <div className="col col-xl-9 order-lg-2 col-lg-9 col-md-9 col-sm-9">
                            <div className="row">
                                {shows.map((show, index) => (
                                    <ShowCard key={index} id={show.id} name={show.name} image={show.image} />
                                ))}
                            </div>
                            {searchTerm === '' && (
                                <a onClick={handleShowMore} className="text-decoration-none">
                                    <div className="p-3">Show More</div>
                                </a>
                            )}
                        </div>
                        <Sidebar isOffcanvasOpen={isOffcanvasOpen} toggleOffcanvas={() => setIsOffcanvasOpen(!isOffcanvasOpen)} />
                    </div>
                </div>
            </div>
        </body>
    );
}

export default Shows;