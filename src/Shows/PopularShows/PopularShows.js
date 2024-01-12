import { useState, useEffect } from "react";
import axios from "axios";
import defaultImage from '../ShowCard/error.jpg';
import ShowCard from "../ShowCard/ShowCard";

function PopularShows() {
    const [shows, setShows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);


    const popularApiUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=${currentPage}`;

    useEffect(() => {
        axios.get(popularApiUrl)
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
    return (
        <div>
            <h2 class="fw-bold text-white mb-1">Popular Shows</h2>
            <div className="d-flex flex-row overflow-auto mb-5">
                {shows.map((show, index) => (
                    <ShowCard key={index} series_id={show.id} name={show.name} image={show.image} />
                ))}
            </div>
        </div>
    )
}

export default PopularShows