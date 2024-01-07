import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Feed from "./Feed/feed";
import Shows from "./Shows/shows";
import Profile from './Profile/profile';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/feed" element={<Feed />} />
          <Route path="/shows" element={<Shows />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/" element={<Feed />} />
        </Routes>
    </Router>
  );
}

export default App;
