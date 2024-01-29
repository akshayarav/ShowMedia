import {React, useState} from 'react';
import { Button } from 'react-bootstrap';
import ShowModal from '../Shows/ShowCard/ShowModal';

function AddToListButton({ show, seasons, isLoading, toggleShowPlanningModal, showPlanningModal, toggleShowDroppedModal, showDroppedModal }) {

  console.log("Show:", show)
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [showWatchingModal, setShowWatchingModal] = useState(false);

  const toggleShowCompletedModal = () => setShowCompletedModal(!showCompletedModal);
  const toggleShowWatchingModal = () => setShowWatchingModal(!showWatchingModal);

  return (
    <div className="dropdown flex-grow-1">
    <Button
      variant="primary"
      type="submit"
      className="btn btn-primary"
      style={{ width: "100%", height: "auto" }}
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <div className="d-flex align-items-center justify-content-center">
        Add to List
        <span className="material-icons md-20">
          expand_more
        </span>
      </div>
    </Button>
    <ul
      className="dropdown-menu fs-13 dropdown-menu-end"
      aria-labelledby="dropdownMenuButton7"
      style={{ position: "relative", zIndex: 1000 }}
    >
      <li>
        <button
          onClick={toggleShowCompletedModal}
          className="dropdown-item text-muted z-top"
          htmlFor="btncheck1"
        >
          <span className="material-icons md-13 me-1">
            add_task
          </span>
          Completed
        </button>
        {!isLoading &&
          show &&
          Array.isArray(show.users) &&
          showCompletedModal && (
            <ShowModal
              closeModal={toggleShowCompletedModal}
              showName={show.name}
              showImg={`https://image.tmdb.org/t/p/w500${show?.poster_path}`}
              series_id={show.id}
              seasons={seasons}
              users={show.users}
              status={"Completed"}
            />
          )}
      </li>
      <li>
        <button
          onClick={toggleShowWatchingModal}
          className="dropdown-item text-muted z-top"
          htmlFor="btncheck2"
        >
          <span className="material-icons md-13 me-1">
            theaters
          </span>
          Watching
        </button>
        {!isLoading &&
          show &&
          Array.isArray(show.users) &&
          showWatchingModal && (
            <ShowModal
              closeModal={toggleShowWatchingModal}
              showName={show.name}
              showImg={`https://image.tmdb.org/t/p/w500${show?.poster_path}`}
              series_id={show.id}
              seasons={seasons}
              users={show.users}
              status={"Watching"}
            />
          )}
      </li>
      <li>
        <button
          onClick={toggleShowPlanningModal}
          className="dropdown-item text-muted z-top"
          htmlFor="btncheck2"
        >
          <span className="material-icons md-13 me-1">
            date_range
          </span>
          Planning
        </button>
        {!isLoading &&
          show &&
          Array.isArray(show.users) &&
          showPlanningModal && (
            <ShowModal
              closeModal={toggleShowPlanningModal}
              showName={show.name}
              showImg={`https://image.tmdb.org/t/p/w500${show?.poster_path}`}
              series_id={show.id}
              seasons={seasons}
              users={show.users}
              status={"Planning"}
            />
          )}
      </li>
      <li>
        <button
          onClick={toggleShowDroppedModal}
          className="dropdown-item text-muted z-top"
          htmlFor="btncheck2"
        >
          <span className="material-icons md-13 me-1">
            theaters
          </span>
          Dropped
        </button>
        {!isLoading &&
          show &&
          Array.isArray(show.users) &&
          showDroppedModal && (
            <ShowModal
              closeModal={toggleShowDroppedModal}
              showName={show.name}
              showImg={`https://image.tmdb.org/t/p/w500${show?.poster_path}`}
              series_id={show.id}
              seasons={seasons}
              users={show.users}
              status={"Dropped"}
            />
          )}
      </li>
    </ul>
  </div>
  );
}

export default AddToListButton;