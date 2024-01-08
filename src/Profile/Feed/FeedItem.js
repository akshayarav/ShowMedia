
function FeedItem ({activity, index}) {
    return (
        <a href="#" key={index} className="p-3 border-bottom d-flex align-items-center text-dark text-decoration-none">
        <div>
            <div className="text-muted fw-light d-flex align-items-center">
                <small>{activity.showName}</small>
                <span className="mx-1 material-icons md-3">circle</span>
                <small>Season {activity.seasonNumber}</small>
            </div>
            <p className="fw-bold mb-0 pe-3">{activity.comment}</p>
            <small className="text-muted">Rating: {activity.rating}</small>
        </div>
        <img
            src={activity.showImage}
            className="img-fluid rounded-4 ms-auto"
            alt={activity.showName}
            style={{ maxWidth: '100px', height: 'auto' }}
        />
    </a>
    )
}

export default FeedItem