import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useContext } from 'react';
import Feed from "./Feed/feed";
import Shows from "./Shows/shows";
import Profile from './Profile/profile';
import AuthContext from './Auth/AuthContext';
import AuthCallback from './Auth/AuthCallback';
import LandingPage from './LandingPage/LandingPage';
import ShowInfoMain from './ShowInfoMain/ShowInfoMain';
import Notifications from './Notifications/notifications';
import Messages from './Messages/messages';

function App() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div></div>; 
  }

  return (
    <Router>
      <Routes>
        {/* Auth callback route must be accessible regardless of auth state */}
        <Route path="/auth-callback" element={<AuthCallback />} />
        
        {/* Conditional rendering of routes based on auth state */}
        {isAuthenticated ? (
          <>
            <Route path="/feed" element={<Feed />} />
            <Route path="/shows" element={<Shows />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/notifications/:username" element={<Notifications />} />
            <Route path="/messages/:username" element={<Messages />} />
            <Route path="/shows/:showId" element={<ShowInfoMain />} />
            <Route path="/" element={<Feed />} />
          </>
        ) : (
          <Route path="*" element={<LandingPage />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;