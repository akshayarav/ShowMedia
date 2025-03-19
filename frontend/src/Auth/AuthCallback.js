// src/components/Auth/AuthCallback.js
import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from './AuthContext';

function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      const userId = params.get('userId');
      const username = params.get('username');
      
      if (token && userId && username) {
        // Log the user in
        const result = await login(token, userId, username);
        
        if (result.success) {
          // Redirect to home page or dashboard
          navigate('/');
        } else {
          // Handle login error
          console.error('Error logging in:', result.error);
          navigate('/login?error=auth');
        }
      } else {
        // Missing parameters, redirect to login
        navigate('/login?error=missing');
      }
    };
    
    handleCallback();
  }, [location, login, navigate]);
  
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Completing authentication...</p>
      </div>
    </div>
  );
}

export default AuthCallback;