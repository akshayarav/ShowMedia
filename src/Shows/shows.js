import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Sidebar from "../Sidebar/sidebar";
import ShowCard from "./ShowCard/ShowCard";
import SearchBar from './SearchBar';

function Shows() {
    const [shows, setShows] = useState([]);
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const filteredShows = shows.filter(show => show.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const apiUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`;

    useEffect(() => {
        Axios.get(apiUrl)
            .then(response => {
                const fetchedShows = response.data.results.map(show => {
                    return {
                        id: show.id,
                        name: show.name,
                        image: `https://image.tmdb.org/t/p/w500${show.poster_path}`
                    };
                });
                setShows(fetchedShows);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }, []);

    const toggleOffcanvas = () => {
        setIsOffcanvasOpen(!isOffcanvasOpen);
    };

    return (
        <body className="bg-light">
            <div className="web-none d-flex align-items-center px-3 pt-3">
                <a href="index.html" className="text-decoration-none">
                    <img src="img/logo.png" className="img-fluid logo-mobile" alt="brand-logo" />
                </a>
                <button className="ms-auto btn btn-primary ln-0" type="button" onClick={toggleOffcanvas}>
                    <span className="material-icons">menu</span>
                </button>
            </div>
            <div className="py-4">
                <div className="container">
                    <div className="row position-relative">
                        <SearchBar onSearch={setSearchTerm} /> {/* Add the SearchBar component */}
                        <div className="col col-xl-9 order-lg-2 col-lg-9 col-md-9 col-sm-9">
                          <div className="row">
                              {filteredShows.map((show, index) => (
                                  <ShowCard key={index} id={show.id} name={show.name} image={show.image} />
                              ))}
                          </div>
                        </div>
                        <Sidebar isOffcanvasOpen={isOffcanvasOpen} toggleOffcanvas={toggleOffcanvas} />
                    </div>
                </div>
            </div>
        </body>
    );
}

export default Shows;