import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Sidebar from "../Sidebar/sidebar";
import ShowCard from "./ShowCard/ShowCard";

function Shows() {
    const [shows, setShows] = useState([]);

    useEffect(() => {
        // Replace 'API_ENDPOINT' with the actual endpoint you want to hit
        Axios.get('API_ENDPOINT')
            .then(response => {
                const fetchedShows = response.data.map(show => {
                    return { name: show.title, image: show.poster };
                });
                setShows(fetchedShows);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }, []);

    return (
        <body className="bg-light">
            <div className="py-4">
                <div className="container">
                    <div className="row position-relative">
                        <Sidebar />
                        {shows.map((show, index) => (
                            <ShowCard key={index} name={show.name} image={show.image} />
                        ))}
                    </div>
                </div>
            </div>
        </body>
    );
}

export default Shows;
