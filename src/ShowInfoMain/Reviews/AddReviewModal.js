import React, { useState } from "react";
import { Modal, Alert, Form, Button } from "react-bootstrap";

function AddReviewModal({ showName, showId, handleAddReview, closeModal }) {
  const [score, setScore] = useState(0);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isReviewVisible, setIsReviewVisible] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("Box Review Added!");
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
        <div className="modal-body p-2 mt-4">
          <div className="d-flex justify-content-between">
            <form onSubmit={handleSubmit} className="flex-grow-1">
              <div className="container">

                <div className="row mt-2 mb-2 p-2">
                  <div className="col-12 bg-glass rounded-4 p-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex text-center align-items-center">
                        <span className="material-icons md-20 me-3" style={{ maxWidth: "20px" }}>star_border_outlined</span>
                        <div className="fw-bold text-muted">Rating</div>
                      </div>
                      <div className="mt-1">
                        <div className="review-score text-muted mb-1">
                          <input
                            type="number"
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                            onBlur={(e) => {
                              if (e.target.value === '') {
                                setScore(0);
                              }
                            }}
                            min="0"
                            max={100}
                            className="text-muted fw-bold"
                            style={{
                              border: 'none',
                              outline: 'none',
                              background: 'transparent',
                              width: 'auto',
                              textAlign: 'right',
                            }}
                          /> / {100}
                        </div>
                      </div>
                    </div>
                    <Form.Group className={`mt-2`}>
                      <Form.Control
                        type="range"
                        min="0"
                        max="100"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        className="progress-bar bg-brown rounded-4"
                        id="customRange"
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className={`row mt-2 mb-2 p-2`}>
                  <div className="col-12 bg-glass rounded-4 p-3">
                    <div role="button" onClick={() => setIsReviewVisible(!isReviewVisible)} className="d-flex align-items-center justify-content-between">
                      <div className="d-flex text-center align-items-center">
                        <span className="material-icons md-20 me-3">notes</span>
                        <div className="fw-bold text-muted">Chatter</div>
                      </div>
                    </div>
                    <Form.Group className={`mt-2 fade-in ${isReviewVisible ? 'visible' : ''}`}>
                      <Form.Control
                        as="textarea"
                        value={text}
                        onChange={(e) => setText(e.target.value)}

                      />
                    </Form.Group>
                  </div>
                </div>
              </div>
              <Button
                variant="primary"
                type="submit"
                className="btn btn-primary w-100 text-decoration-none rounded-5 py-3 fw-bold text-uppercase mt-4"
              >
                Submit Chat
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default AddReviewModal;
