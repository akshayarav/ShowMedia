function ShowCard({ name, image }) {
    return (
        <main className="col col-xl-3 col-lg-6 order-lg-1 col-md-6 col-sm-6 col-6">
            <div class="bg-white rounded-4 shadow-sm profile">
                <div class="d-flex align-items-center px-3 pt-3">
                    <div class="ms-3">
                        <img src={image} class="img-fluid rounded mb-3 show-card-image" alt="post-img" />
                        <p class="text-muted mb-0">{name}</p>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ShowCard