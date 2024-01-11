import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useContext } from 'react';
import Feed from "./Feed/feed";
import Shows from "./Shows/shows";
import Profile from './Profile/profile';
import AuthContext from './AuthContext';
import LandingPage from './LandingPage/LandingPage';

function App() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  console.log(isLoading)

  if (isLoading) {
    return <div></div>; // Or return null, or any loading indicator
}

  if (isAuthenticated) {
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

  return (<LandingPage />)

}

export default App;
