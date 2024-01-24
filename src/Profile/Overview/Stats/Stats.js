import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
function Stats() {

    const { username } = useParams();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [stats, setStats] = useState({ showsSeen: 0, episodesWatched: 0, averageRating: 0 });

    useEffect(() => {
        axios.get(`${apiUrl}/api/user/stats/${username}`)
            .then(response => {
                setStats({
                    showsSeen: response.data.totalShows,
                    episodesWatched: response.data.totalEpisodes,
                    averageRating: response.data.averageRating
                });
            })
            .catch(error => {
                console.error('Error fetching stats:', error);
                // Handle the error appropriately in your application
            });
    }, [username]);

    console.log("STATS" + stats)

    return (
        <div className="bg-glass rounded-4 mt-3 offset-1 col-10">
            <div className="d-flex justify-content-between mt-2 mb-2">
                <div className="d-flex flex-column align-items-center border-end flex-grow-1">
                    <h6 className="fw-bold text-primary">
                        Shows Seen
                    </h6>
                    <h4>{stats.showsSeen}</h4>
                </div>
                <div className="border-start border-end d-flex flex-column align-items-center flex-grow-1">
                    <h6 className="fw-bold text-primary ">
                        Episodes Watched
                    </h6>
                    <h4>{stats.episodesWatched}</h4>
                </div>
                <div className="border-start d-flex flex-column align-items-center flex-grow-1">
                    <h6 className="fw-bold text-primary ">
                        Average Rating
                    </h6>
                    <h4>{stats.averageRating}</h4>
                </div>
            </div>
        </div>
    )
}

export default Stats