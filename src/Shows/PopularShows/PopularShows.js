import { useState, useEffect } from "react";
import axios from "axios";
import defaultImage from '../ShowCard/error.jpg';
import ShowCard from "../ShowCard/ShowCard";

function PopularShows({ recShows, selectedGenres }) {
    const [shows, setShows] = useState([]);

    const popularApiUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`;
    useEffect(() => {
        if (recShows) {
            axios.get(popularApiUrl)
                .then(response => {
                    const newShows = response.data.results
                        .map(show => {
                            return {
                            id: show.id,
                            name: show.name,
                            image: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : defaultImage,
                            series_id: show.id,
                            genre_ids: show.genre_ids,
                            users: recShows.has(show.id.toString()) ? recShows.get(show.id.toString()).users : []
                        };
                    });
                    if (selectedGenres.length === 0) {
                        setShows(newShows)
                    }
                    else {
                        const filterShows = newShows.filter(show => {
                            return show.genre_ids.some(genreId => selectedGenres.includes(genreId))})
                        setShows(filterShows)
                    }
                })
                .catch(error => {
                    console.error('Error fetching data: ', error);
                });
        }
    }, [recShows, selectedGenres]);


    return (
        <div>
            <h2 className="fw-bold text-white mb-1">Popular Shows</h2>
            <div className="d-flex flex-row overflow-auto mb-5">
                {shows.map((show, index) => (
                    <ShowCard key={index} series_id={show.id} name={show.name} image={show.image} users={show.users} />
                ))}
            </div>
        </div>
    )
}

export default PopularShows