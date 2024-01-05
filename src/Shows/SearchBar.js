import React from 'react';

function SearchBar({ onSearch }) {
    return (
        <div className="sticky-sidebar2 mb-3">
            <div className="input-group mb-4 shadow-sm rounded-4 overflow-hidden py-2 bg-white">
                <span className="input-group-text material-icons border-0 bg-white text-primary">search</span>
                <input
                    type="text"
                    className="form-control border-0 fw-light ps-1"
                    placeholder="Search shows"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
        </div>
    );
}

export default SearchBar;