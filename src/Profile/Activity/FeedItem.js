import React from 'react';
import error from './error.jpg'

function FeedItem({ activity }) {
    const formattedTimestamp = new Date(activity.timestamp).toLocaleString();
    const image = activity.showImage ? `https://image.tmdb.org/t/p/w500${activity.showImage}` : error

    const status = activity.status === "Watching" ? `just watched the ${activity.episodes} episode of` : 
        activity.status === "Planning" ? "is planning to watch" : 
            activity.status === "Completed" ? "completed" : 
                activity.status === "Dropped" ? "dropped" : console.error("Activity has invalid status")

    const username = activity.username ? activity.username : activity.user.username
    const first = activity.first ? activity.first : activity.user.first

    return (
        <div key={activity._id} className="p-3 border-bottom d-flex align-items-start text-white text-decoration-none">
            <div className="flex-grow-1">
                <div className="mb-2 d-flex align-items-center">
                    <small className="text-muted">@{username}</small>
                    <span className="mx-2 material-icons md-3">circle</span>
                    <small className="text-muted">{formattedTimestamp}</small>
                </div>

                <div className="mb-2">
                    <h6 className="mb-0">
                        {first} {status}
                    </h6>
                </div>

                <div className="mb-2">
                    <h5 className="mb-0">
                        {activity.showName} - <span >Season {activity.seasonNumber}</span>
                    </h5>
                </div>

                <div className="mb-2">
                    <h6 className="mb-1 fw-bold">Season Rating: {activity.rating}/10</h6>
                    <br></br>
                    <p className="mb-1"> "{activity.comment}"</p> 
                </div>
            </div>

            <img
                src={image}
                className="img-fluid rounded-4 ms-3"
                alt={activity.showName}
                style={{ maxWidth: '100px', height: 'auto' }}
            />
        </div>
    );
}

export default FeedItem;