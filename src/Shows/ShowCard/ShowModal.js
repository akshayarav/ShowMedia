import React, { useState, useContext } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';

function ShowModal({ closeModal, showName, showImg, id }) {
    const [rating, setRating] = useState(0)
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;

    function countDecimals(value) {
        if (Math.floor(value) === value) return 0;
        const str = value.toString(); 
        const index = str.indexOf('.'); 
        if (index === -1) return 0;
        return str.length - index - 1; 
    }
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const userId = localStorage.getItem('userId');

        if (rating > 10 || rating < 1) {
            setError("Show rating must be on scale 1-10")
            return
        }

        if (!userId) {
            setError('Log In First!');
            return; 
        }

        const showId = id
        console.log(JSON.stringify({
            userId,
            showId,
            rating
        }));

        console.log("URL" + `${apiUrl}/rate`)

        try {
            const response = await fetch(`${apiUrl}/rate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    showId,
                    rating
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Show rating added successfully!');
            } else {
                setError(data.message || 'Failed to add rating');
            }
        } catch (err) {
            setError('Server error');
        }}

    return (
        <Modal show={true} onHide={closeModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add Show</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <div className="modal-content rounded-4 p-4 border-0">
                    <div className="modal-header border-0 p-1">
                        <h6 className="modal-title fw-bold text-body fs-6" id="exampleModalLabel">{showName}</h6>
                    </div>
                    <div className="image-container">
                        <img src={showImg} className="img-fluid rounded-top" alt={showName} />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-0">
                            <div className="row py-3 gy-3 m-0">
                                <div className="mt-5 login-register" id="number">
                                    <h6 className="fw-bold mx-1 mb-2 text-dark">Rating</h6>
                                    <div className="row mx-0 mb-3">
                                        <div className="col-9 p-1">
                                            <div className="form-floating d-flex align-items-end">
                                                <input
                                                    type="text"
                                                    className="form-control rounded-5"
                                                    id="floatingRating"
                                                    value={rating}
                                                    onChange={(e) => setRating(e.target.value)}
                                                    placeholder="Enter Rating"
                                                    maxLength="3"
                                                />
                                                <label htmlFor="floatingRating">Rating</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-1">
                                        <button type="submit" className="btn btn-primary w-100 text-decoration-none rounded-5 py-3 fw-bold text-uppercase m-0">Add Show</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export default ShowModal