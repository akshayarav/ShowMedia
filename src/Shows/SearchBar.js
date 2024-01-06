import React from 'react';

function SearchBar({ onSearch }) {
    return (
        // Modified the class to use col-xl-9 and added an offset of 3 for xl screens
        <div className="col">
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
