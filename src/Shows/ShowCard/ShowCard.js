import { useState, useEffect } from "react";
import Axios from "axios";
import ShowModal from "./ShowModal";

function ShowCard({ name, image, series_id }) {
    const [showModal, setShowModal] = useState(false);
    const [seasons, setSeasons] = useState([]);

    useEffect(() => {
        const fetchSeasons = async () => {
            try {
                const seriesResponse = await Axios.get(`https://api.themoviedb.org/3/tv/${series_id}?api_key=${process.env.REACT_APP_API_KEY}`);
                const totalSeasons = seriesResponse.data.number_of_seasons;

                let seasonsDetails = [];
                for (let i = 1; i <= totalSeasons; i++) {
                    const seasonResponse = await Axios.get(`https://api.themoviedb.org/3/tv/${series_id}/season/${i}?api_key=${process.env.REACT_APP_API_KEY}`);
                    seasonsDetails.push(seasonResponse.data);
                }
                setSeasons(seasonsDetails);
            } catch (error) {
                console.error('Error fetching season details: ', error);
            }
        };

        fetchSeasons();
    }, [series_id]);

    const toggleShowModal = () => {
        setShowModal(!showModal);
    };

    return (
        <main className="col col-xl-2 col-lg-6 col-md-6 col-sm-6 col-6">
            <div className="bg-white rounded-4 shadow-sm profile">
                <div
                    role="button"
                    tabIndex="0"
                    onClick={toggleShowModal}
                >
                    <div className="image-container">
                        <img src={image} className="img-fluid rounded-top" alt={name} />
                    </div>
                    <div className="details-container p-3">
                        <p className="text-muted mb-0">{name}</p>
                    </div>
                </div>
                {showModal && <ShowModal closeModal={toggleShowModal} showName={name} showImg={image} series_id={series_id} seasons={seasons} />}
            </div>
        </main>
    )
}

export default ShowCard;