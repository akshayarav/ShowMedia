import React, { useState } from 'react';
import { Modal } from "react-bootstrap";

function AddReviewModal({ showId, handleAddReview, closeModal }) {
    // State for handling form inputs
    const [score, setScore] = useState('');
    const [text, setText] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Call the handleAddReview passed from parent with the review details
        handleAddReview(showId, score, text);
        closeModal(); // Close the modal after submitting the review
    };

    return (
        <Modal show={true} onHide={closeModal} centered className="modal fade bg-glass">
            <div className="rounded-4 shadow-sm p-4 border-0 bg-brown-gradient-color">
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="scoreInput">Score</label>
                        <input
                            type="number"
                            className="form-control"
                            id="scoreInput"
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                            placeholder="Enter score"
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="textInput">Review Text</label>
                        <textarea
                            className="form-control"
                            id="textInput"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter your review"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit Review</button>
                </form>
            </div>
        </Modal>
    );
}

export default AddReviewModal;
