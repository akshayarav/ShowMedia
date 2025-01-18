import {React} from 'react';

function AddToListButton({openModal}) {
  
  return (
    <div className="flex-grow-1">
    <button
      className="btn btn-primary"
      style={{ width: "100%", height: "auto" }}
      onClick = {() => openModal()}
    >
      <div className="d-flex align-items-center justify-content-center">
        Add to List
      </div>
    </button>
  </div>
  );
}

export default AddToListButton;