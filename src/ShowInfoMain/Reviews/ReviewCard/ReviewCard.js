import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../../AuthContext";

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
    <div className="d-flex justify-content-between p-2">
      <div
        className="bg-glass rounded-4 shadow-sm p-1"
        style={{ width: "60vw" }}
      >
        <div className="d-flex justify-content-between border-bottom">
          <Link
            to={`/profile/${review.username}`}
            className="d-flex me-3 mt-3"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <img
              src={review.profileImg}
              alt="Profile"
              className="rounded-circle mb-4"
              style={{ width: "40px", height: "40px" }}
            />
          </Link>
          <div className="d-flex flex-column justify-content-center me-4">
            <div className="d-flex align-items-center">
              <p className="text-white mb-0">
                {userDetails && userDetails.first}
              </p>
              <p className="ms-1 text-muted mb-0">@{review.username}</p>
              <p className="text-muted ms-2 mb-0">{formattedTimestamp}</p>
            </div>
            <h6 className="review-count-details-container mt-1 text-muted">
              {userDetails && userDetails.reviewCount} total chats
              <span className="fs-3 material-icons md-10 ms-1 me-1">circle</span>
              {showName}
            </h6>
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1 rounded-4 p-1">
            <div className="align-self-end mb-2">
              <a href="#" className="text-muted text-decoration-none material-icons ms-2 md-20 bg-glass rounded-circle p-1" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">more_vert</a>
              <ul className="dropdown-menu fs-13 dropdown-menu-end bg-light" aria-labelledby="dropdownMenuButton6">
                {handleRemoveReview ? <li>
                  <button onClick={handleRemoveReview} className="dropdown-item text-muted" htmlFor="btncheck1">
                    <span className="material-icons md-13 me-1"> delete_outline</span>
                    Remove Review
                  </button>
                </li> :
                  <li>
                    <button className="dropdown-item text-muted" htmlFor="btncheck2">
                      <span className="material-icons md-13 me-1"> report </span>
                      Report
                    </button>
                  </li>}
              </ul>
            </div>

              <div className="progress" style={{ width: "100%" }}>
                <div
                  className="progress-bar bg-brown"
                  role="progressbar"
                  style={{ width: `${review.score}%` }}
                  aria-valuenow={review.score}
                  aria-valuemin="0"
                  aria-valuemax="100">
                </div>
              </div>
              <div className="mt-1">
                <h6 className="review-score">{review.score} / 100</h6>
              </div>
            </div>

          <div className="ms-auto d-flex m-1">

          </div>
        </div>
        <div className="d-flex justify-content-between">
          <div className="mb-2 col-10 bg-glass rounded-4 mt-3">
            <p className="ms-4 mt-3" style={{ wordBreak: "break-all" }}>
              {review.text}
            </p>
          </div>
          <div className="d-flex align-items-end justify-content-center mb-1">
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
            <div className="mb-1 ms-1 me-1">{votesState}</div>
            <div role="button" onClick={() => handleVote("downvote")}>
              <span
                className="material-icons me-2"
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
  );
}

export default ReviewCard;
