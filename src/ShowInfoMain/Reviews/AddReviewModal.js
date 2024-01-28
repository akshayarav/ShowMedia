import React, { useState } from "react";
import { Modal, Alert } from "react-bootstrap";

function AddReviewModal({ showName, showId, handleAddReview, closeModal }) {
  const [score, setScore] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("test");
    handleAddReview(showId, score, text);
    setTimeout(() => {
      closeModal();
    }, 1000);
  };

  return (
    <Modal
      show={true}
      onHide={closeModal}
      centered
      className="modal fade bg-glass"
    >
      <div className="rounded-4 shadow-sm p-4 border-0 bg-brown-gradient-color">
        <h5 className="modal-title mb-3">{showName}</h5>{" "}
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="scoreInput">Score (out of 100)</label>
            <input
              type="number"
              className="form-control white-placeholder"
              id="scoreInput"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              min="0"
              max="100"
              placeholder="Enter score (0-100)"
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="textInput">Review Text</label>
            <textarea
              className="form-control white-placeholder"
              id="textInput"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your review"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit Review
          </button>
        </form>
      </div>
    </Modal>
  );
}

export default AddReviewModal;
