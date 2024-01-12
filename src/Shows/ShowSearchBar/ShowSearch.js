import React from 'react';

function ShowSearch({ onSearch }) {
    return (
        <div className="col">
            <div className="input-group mb-4 shadow-sm rounded-4 overflow-hidden py-2 bg-glass">
                <span className="input-group-text material-icons border-0 bg-transparent text-primary">search</span>
                <input
                    type="text"
                    className="form-control border-0 fw-light bg-transparent ps-1"
                    placeholder="Search shows"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
        </div>
    );
}

export default ShowSearch;
