import React from 'react';
import error from './error.jpg'

function FeedItem({ activity }) {
    const formattedTimestamp = new Date(activity.timestamp).toLocaleString();
    const image = activity.showImage ? `https://image.tmdb.org/t/p/w500${activity.showImage}` : error

    return (
        <div key={activity._id} className="p-3 border-bottom d-flex align-items-start text-dark text-decoration-none">
            <div className="flex-grow-1">
                <div className="mb-2 d-flex align-items-center">
                    <small className="text-muted">@{activity.username}</small>
                    <span className="mx-2 material-icons md-3">circle</span>
                    <small className="text-muted">{formattedTimestamp}</small>
                </div>

                <div className="mb-2">
                    <h5 className="mb-0">
                        {activity.showName} - <span className="text-muted">Season {activity.seasonNumber}</span>
                    </h5>
                </div>

                <div className="mb-2">
                    <h5 className="fw-bold mb-1">{activity.rating}/10</h5> {/* Rating */}
                    <p className="mb-0"><i>"{activity.comment}"</i></p> {/* Comment */}
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