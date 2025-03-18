import FollowerRecShows from "./FollowerRecShows/FollowerRecShows"
import ApiShows from "./ApiShows/ApiShows"

function ShowList({ recShows, selectedGenres }) {
    return (
        <div>
            {recShows && recShows.size > 0 && (
                <FollowerRecShows
                    recShows={recShows}
                    selectedGenres={selectedGenres}
                />
            )}
            <h2 className="fw-bold text-white mb-1">Popular</h2>
            <ApiShows
                recShows={recShows}
                selectedGenres={selectedGenres}
                list={"popular"}
            />
            <h2 className="fw-bold text-white mb-1">Top Rated</h2>
            <ApiShows
                recShows={recShows}
                selectedGenres={selectedGenres}
                list={"top_rated"}
            />
            <h2 className="fw-bold text-white mb-1">Trending</h2>
            <ApiShows
                recShows={recShows}
                selectedGenres={selectedGenres}
                list={"trending"}
            />
        </div>

    )
}

export default ShowList