import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../../Auth/AuthContext";

function ReviewCard({ showName, review, handleRemoveReview }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const reviewId = review._id;
  const userId = localStorage.getItem("userId");
  const [userDetails, setUserDetails] = useState(null);
  const [votesState, setVotesState] = useState(
    review.upvotes.length - review.downvotes.length
  );
  const state = review.upvotes.includes(userId)
    ? "upvote"
    : review.downvotes.includes(userId)
      ? "downvote"
      : null;
  const [userVote, setUserVote] = useState(state);
  const formattedTimestamp = new Date(review.updatedAt).toLocaleString();

  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/user/${review.username}`
        );
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (review.username) {
      fetchUserDetails();
    }
  }, [review.username, apiUrl]);

  const handleVote = async (type) => {
    let updatedReview = { ...review };
    if (userVote === type) {
      try {
        await axios.post(`${apiUrl}/api/reviews/${reviewId}/unvote`, {
          userId: userId,
        });
        updatedReview.votes =
          type === "upvote" ? votesState - 1 : votesState + 1;
        setUserVote(null);
      } catch (error) {
        console.error(`Error undoing vote:`, error);
        return;
      }
    } else {
      try {
        await axios.post(`${apiUrl}/api/reviews/${reviewId}/${type}`, {
          userId: userId,
        });
        updatedReview.votes =
          type === "upvote"
            ? userVote === "downvote"
              ? votesState + 2
              : votesState + 1
            : userVote === "upvote"
              ? votesState - 2
              : votesState - 1;
        setUserVote(type);
      } catch (error) {
        console.error(
          `Error ${type === "upvote" ? "upvoting" : "downvoting"}:`,
          error
        );
        return;
      }
    }
    setVotesState(updatedReview.votes);
  };

  return (
    <div className="container mb-3">
      <div className="row">
        <div className="bg-glass rounded-4 shadow-sm p-3 col-12">
          {/* User info section */}
          <div className="d-flex flex-column flex-md-row justify-content-between border-bottom pb-2">
            {/* Profile image and user details */}
            <div className="d-flex align-items-start">
              <Link
                to={`/profile/${review.username}`}
                className="me-2"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <img
                  src={review.profileImg}
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: "40px", height: "40px" }}
                />
              </Link>
              <div className="d-flex flex-column">
                <div className="d-flex flex-wrap align-items-center">
                  <p className="text-white mb-0 me-1">
                    {userDetails && userDetails.first}
                  </p>
                  <p className="text-muted mb-0">@{review.username}</p>
                </div>
                <p className="text-muted mb-0 small">{formattedTimestamp}</p>
                <h6 className="review-count-details-container mt-1 text-muted small">
                  {userDetails && userDetails.reviewCount} total chats
                  <span className="material-icons" style={{ fontSize: '0.5rem', margin: '0 4px' }}>
                    circle
                  </span>
                  {showName}
                </h6>
              </div>
            </div>

            {/* Rating and menu */}
            <div className="d-flex mt-2 mt-md-0 align-items-center">
              <div className="d-flex flex-column me-2" style={{ minWidth: "120px" }}>
                <div className="progress">
                  <div
                    className="progress-bar bg-brown"
                    role="progressbar"
                    style={{ width: `${review.score}%` }}
                    aria-valuenow={review.score}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <div className="mt-1">
                  <div className="review-score text-center small">
                    {review.score} / 100
                  </div>
                </div>
              </div>

              <a
                href="#"
                className="text-muted text-decoration-none material-icons bg-glass rounded-circle p-1"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                more_vert
              </a>
              <ul
                className="dropdown-menu fs-13 dropdown-menu-end bg-light"
                aria-labelledby="dropdownMenuButton6"
              >
                {handleRemoveReview ? (
                  <li>
                    <button
                      onClick={handleRemoveReview}
                      className="dropdown-item text-muted"
                      htmlFor="btncheck1"
                    >
                      <span className="material-icons md-13 me-1">delete_outline</span>
                      Remove Review
                    </button>
                  </li>
                ) : (
                  <li>
                    <button
                      className="dropdown-item text-muted"
                      htmlFor="btncheck2"
                    >
                      <span className="material-icons md-13 me-1">report</span>
                      Report
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Review text and voting */}
          <div className="d-flex flex-column flex-md-row justify-content-between bg-glass p-2 mt-2">
            <div className="col-12 col-md-10 mb-2 mb-md-0">
              <p className="mb-0" style={{ wordBreak: "break-word" }}>
                {review.text}
              </p>
            </div>
            <div className="d-flex align-items-center justify-content-end">
              <div role="button" onClick={() => handleVote("upvote")}>
                <span
                  className="material-icons"
                  style={{
                    color: userVote === "upvote" ? "orange" : "white",
                    fontSize: userVote === "upvote" ? "22px" : "20px",
                  }}
                >
                  arrow_upward
                </span>
              </div>
              <div className="mx-2">{votesState}</div>
              <div role="button" onClick={() => handleVote("downvote")}>
                <span
                  className="material-icons"
                  style={{
                    color: userVote === "downvote" ? "orange" : "white",
                    fontSize: userVote === "downvote" ? "22px" : "20px",
                  }}
                >
                  arrow_downward
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;