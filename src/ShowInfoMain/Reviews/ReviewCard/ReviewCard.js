function ReviewCard({ score, text, profileImg, username }) {
    return (
        <main className="col-11 my-2">
            <div className="bg-glass rounded-4 shadow-sm p-3">
                <div className="d-flex align-items-center mb-2">
                    <img src={profileImg} alt="Profile" className="rounded-circle me-2" style={{ width: '40px', height: '40px' }} />
                    <strong>{username}</strong>
                </div>
                <div className="mb-2">
                    <span className="badge bg-primary">{`Score: ${score}`}</span>
                </div>
                <p>{text}</p>
            </div>
        </main>
    );
}

export default ReviewCard;
