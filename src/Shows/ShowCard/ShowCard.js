function ShowCard({ name, image }) {
    return (
        <main className="col col-xl-2 col-lg-6 col-md-6 col-sm-6 col-6">
            <div className="bg-white rounded-4 shadow-sm profile">
                {/* Image container */}
                <div className="image-container">
                    <img src={image} className="img-fluid rounded-top" alt={name} />
                </div>
                {/* Details container */}
                <div className="details-container p-3">
                    <p className="text-muted mb-0">{name}</p>
                </div>
            </div>
        </main>
    )
}

export default ShowCard
