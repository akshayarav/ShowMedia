import { useState, useEffect } from "react";
import axios from "axios";
import defaultImage from '../ShowCard/error.jpg';
import ShowCard from "../ShowCard/ShowCard";

function PopularShows() {
    const [shows, setShows] = useState([]);
    const [recShows, setRecShows] = useState(null)
    const [currentPage, setCurrentPage] = useState(1);
    const userId = localStorage.getItem('userId')
    const apiUrl = process.env.REACT_APP_API_URL

    const popularApiUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=${currentPage}`;

    useEffect(() => {
        axios.get(`${apiUrl}/api/following/shows/${userId}`)
            .then(response => {
                let dataMap = new Map(response.data.map(item => {
                    let id = item[0]; // The first element is the ID
                    let associatedObject = item[1]; // The second element is the associated object

                    return [id, associatedObject]; // Returning an array [id, associatedObject] for the Map constructor
                }));
                setRecShows(dataMap);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }, []);

    useEffect(() => {
        if (recShows) {
            axios.get(popularApiUrl)
                .then(response => {
                    const newShows = response.data.results.map(show => ({
                        id: show.id,
                        name: show.name,
                        image: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : defaultImage,
                        series_id: show.id,
                        users: recShows.has(show.id.toString()) ? recShows.get(show.id.toString()).users : []
                    }));
                    setShows(prevShows => [...prevShows, ...newShows]);
                })
                .catch(error => {
                    console.error('Error fetching data: ', error);
                });
        }
    }, [currentPage, popularApiUrl, recShows]);

    return (
        <div>
            <h2 class="fw-bold text-white mb-1">Popular Shows</h2>
            <div className="d-flex flex-row overflow-auto mb-5">
                {shows.map((show, index) => (
                    <ShowCard key={index} series_id={show.id} name={show.name} image={show.image} users = {show.users}/>
                ))}
            </div>
        </div>
    )
}

export default PopularShows