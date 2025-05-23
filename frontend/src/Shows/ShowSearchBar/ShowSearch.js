import { useState, useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';

function ShowSearch({ onSearch, addGenre, selectedGenres, initialSearchTerm = '' }) {
    const tmdbApiKey = process.env.REACT_APP_API_KEY;
    const [genres, setGenres] = useState([]);
    const [inputValue, setInputValue] = useState(initialSearchTerm);
    const dropdownMenuRef = useRef(null);
    const typingTimerRef = useRef(null);

    // Initialize with initialSearchTerm if provided
    useEffect(() => {
        if (initialSearchTerm) {
            setInputValue(initialSearchTerm);
        }
    }, [initialSearchTerm]);

    const handleDropdownClick = (e) => {
        // Check if the click is not on a checkbox
        if (e.target.type !== 'checkbox') {
            e.stopPropagation();
        }
    };

    useEffect(() => {
        const dropdownElement = dropdownMenuRef.current;
        if (dropdownElement) {
            dropdownElement.addEventListener('click', handleDropdownClick);
            return () => dropdownElement.removeEventListener('click', handleDropdownClick);
        }
    }, []);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${tmdbApiKey}&language=en-US`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                return data.genres; // This will be an array of genre objects
            } catch (error) {
                console.error('Error fetching genres:', error);
                return [];
            }
        };

        const loadGenres = async () => {
            const fetchedGenres = await fetchGenres();
            setGenres(fetchedGenres || []);
        };

        loadGenres();
    }, [tmdbApiKey]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        
        // Clear any existing timer
        if (typingTimerRef.current) {
            clearTimeout(typingTimerRef.current);
        }
        
        // Set a new timer
        typingTimerRef.current = setTimeout(() => {
            onSearch(value); // This is what triggers the search
        }, 500); // 1.2 seconds delay - very noticeable for testing
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (typingTimerRef.current) {
                clearTimeout(typingTimerRef.current);
            }
        };
    }, []);

    return (
        <div className="row">
            <div className="col-10">
                <div className="input-group mb-4 shadow-sm rounded-4 overflow-hidden py-2 bg-glass">
                    <span className="input-group-text material-icons border-0 bg-transparent text-primary">search</span>
                    <input
                        type="text"
                        className="form-control border-0 fw-light bg-transparent ps-1"
                        placeholder="Search for a show"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            <div className="col-2">
                <div className="d-flex mt-1 justify-content-center">
                    <div className="dropdown flex-grow-1">
                        <Button variant="primary" type="submit" className="btn btn-primary" style={{ width: '100%', height: 'auto' }} data-bs-toggle="dropdown" aria-expanded="false">
                            <div className="d-flex align-items-center justify-content-center">
                                Genres
                                <span className="material-icons md-20">expand_more</span>
                            </div>
                        </Button>
                        <ul ref={dropdownMenuRef} className="dropdown-menu fs-13 dropdown-menu-end" aria-labelledby="dropdownMenuButton9">
                            {genres && genres.map(genre => (
                                <label key={genre.id} className="dropdown-item text-muted z-top">
                                    <li>
                                        <input
                                            type="checkbox"
                                            checked={selectedGenres?.includes(genre.id)}
                                            onChange={() => addGenre(genre.id)}
                                            className="me-2"
                                        />
                                        {genre.name}
                                    </li>
                                </label>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShowSearch;