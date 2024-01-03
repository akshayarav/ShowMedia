import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Feed from "./Feed/feed";
import Shows from "./Shows/shows";
import Sidebar from './Sidebar/sidebar';
import Profile from './Profile/profile';

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/feed" element={<Feed />} />
          <Route path="/shows" element={<Shows />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Feed />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
