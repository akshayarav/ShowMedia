
import { useEffect, useState } from "react"
import axios from "axios"
import ShowCard from "../ShowCard/ShowCard"
import defaultImage from '../ShowCard/error.jpg';

function FollowerRecShows({recShows}) {
    const [shows, setShows] = useState([])

    const tmdbApiKey = process.env.REACT_APP_API_KEY

    async function fetchShowDetails(showId) {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/tv/${showId}?api_key=${tmdbApiKey}`);
            response.data.users = recShows.get(showId).users
            return response.data; 
        } catch (error) {
            console.error(`Error fetching data for show ID ${showId}:`, error);
            return null; 
        }
    }

    async function getAllShowDetails(showIds) {
        const showDetailsPromises = Array.from(showIds.keys()).map(showId => {
            return fetchShowDetails(showId);
        });
        
        const showsDetails = await Promise.all(showDetailsPromises);

        const uniqueShows = new Set(showsDetails.filter(show => show !== null));

        return uniqueShows;
    }

    useEffect(() => {
        async function updateShows() {
            const detailedShows = await getAllShowDetails(recShows);
            setShows(Array.from(detailedShows));
        }

        if (recShows && recShows.size > 0) {
            updateShows();
        }
    }, [recShows]);


    return (<div>
        <h2 class="fw-bold text-white mb-1">Shows Watched by Friends</h2>
        <div className="d-flex flex-row overflow-auto mb-5">
            {shows.map((show, index) => {
                return <ShowCard key={index} series_id={show.id} name={show.name} image={show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : defaultImage} users = {show.users}/>;
            })}
        </div>
    </div>)
}

export default FollowerRecShows