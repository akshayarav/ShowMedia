import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

function Stats() {
  // 1. **Total Number of Shows Watched**: Display the total count of distinct TV shows the user has watched.

  // 2. **Total Episodes Watched**: Count the total number of episodes across all shows the user has logged.

  // 3. **Total Hours Spent Watching**: Calculate the aggregate time spent watching, based on the runtime of each episode. This gives users an idea of how much time they've invested in watching shows.

  // 4. **Most-Watched Genre**: Identify the genre the user watches the most, which can be insightful for personal preferences.

  // 5. **Average Rating Given**: If users rate shows, display their average rating to reflect their overall taste and standards.

  // 6. **Number of Shows/Episodes Watched This Year/Month**: Provide statistics for the current year or month, offering insights into their recent watching habits.

  // 7. **Longest Show Binge**: Identify the show with the most number of episodes that the user watched in the shortest amount of time.

  // 8. **Favorite Show**: This could be based on the highest-rated show or the show they've rewatched the most.

  // 9. **Unique Shows per Genre**: A count of how many different shows the user has watched in each genre.

  // 10. **Completion Percentage**: For users who add shows to a watchlist, show a percentage of how many they've completed versus those still pending.

  // 11. **Streaks and Milestones**: Highlight any continuous streaks (like watching a show daily) or milestones (like 100th show watched).

  // 12. **Shows Watched from Different Countries**: If applicable, showing the diversity of the user's watching habits by counting the number of countries the shows are from.

  const { username } = useParams();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [stats, setStats] = useState({
    showsSeen: 0,
    episodesWatched: 0,
    averageRating: 0,
    totalHours: 0,
    monthlyActivity: 0,
    favoriteGenre: null,
    highestRatedShow: null,
  });

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/user/stats/${username}`)
      .then((response) => {
        setStats({
          showsSeen: response.data.totalShows,
          episodesWatched: response.data.totalEpisodes,
          averageRating: response.data.averageRating,
          totalHours: response.data.totalHours,
          monthlyActivity: response.data.monthlyActivity,
          favoriteGenre: response.data.favoriteGenre,
          highestRatedShow: response.data.highestRatedShow,
        });
      })
      .catch((error) => {
        console.error("Error fetching stats:", error);
        // Handle the error appropriately in your application
      });
  }, [username]);

  const chartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Shows Watched per Month",
        data: stats.monthlyActivity,
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  return (
    <div>
      <div className="bg-glass rounded-4 mt-3 col-12">
        <div className="d-flex justify-content-between mt-2 mb-2">
          <div className="d-flex flex-column align-items-center border-end flex-grow-1 mt-2">
            <h6 className="fw-bold text-primary">Shows Seen</h6>
            <h4>{stats.showsSeen}</h4>
          </div>
          <div className="border-end d-flex flex-column align-items-center flex-grow-1 mt-2">
            <h6 className="fw-bold text-primary ">Episodes Watched</h6>
            <h4>{stats.episodesWatched}</h4>
          </div>
          <div className="border-end d-flex flex-column align-items-center flex-grow-1 mt-2">
            <h6 className="fw-bold text-primary ">Average Rating</h6>
            <h4>{stats.averageRating}</h4>
          </div>
          <div className="d-flex flex-column align-items-center flex-grow-1 mt-2">
            <h6 className="fw-bold text-primary ">Hours Watched</h6>
            <h4>{stats.totalHours}</h4>
          </div>
        </div>
      </div>
      {/* Chart Element */}
      <div className="chart-container mb-2">
        <Line data={chartData} />
      </div>
      <div className="bg-glass rounded-4 mt-3">
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-column align-items-center border-end flex-grow-1 mt-2 mb-2">
            <h6 className="fw-bold text-primary">Favorite Genre</h6>
            <div className="stats-details-container text-white">
              {stats.favoriteGenre}
            </div>
          </div>
          <div className="d-flex flex-column align-items-center flex-grow-1 mt-2 mb-2">
            <h6 className="fw-bold text-primary">Highest Rated Show</h6>
            <div className="stats-details-container text-white">
              {stats.highestRatedShow?.showName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
