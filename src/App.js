import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useContext } from 'react';
import Feed from "./Feed/feed";
import Shows from "./Shows/shows";
import Profile from './Profile/profile';
import AuthContext from './AuthContext';
import LandingPage from './LandingPage/LandingPage';
import ShowInfoMain from './ShowInfoMain/ShowInfoMain';
import Notifications from './Notifications/notifications';
import Messages from './Messages/messages';

function App() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div></div>; 
}

  if (isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/feed" element={<Feed />} />
          <Route path="/shows" element={<Shows />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/notifications/:username" element={<Notifications />} />
          <Route path="/messages/:username" element={<Messages />} />
          <Route path="/shows/:showId" element={<ShowInfoMain />} />
          <Route path="/" element={<Feed />} />
        </Routes>
      </Router>
    );
  }

  return (<LandingPage />)

}

export default App;
