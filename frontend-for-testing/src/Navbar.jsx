import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from './AuthContext';
import profileIcon from '../src/Assets/user_icon.jpg';

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userProfile, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleJoinUsClick = () => {
    navigate('/user/login');
  };

  const handleMarketplaceClick = () => {
    navigate('/marketplace');
  };

  const handleLeaderboardClick = () => {
    navigate('/leaderboard');
  };

  const handleHowToPlayClick = () => {
    navigate('/HowToPlay');
  };

  const handleTeamClick = () => {
    navigate('/team');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/user/userProfile');
  };

  return (
    <div className='navbawr'>
      <a className="navbar-text" onClick={handleHomeClick}>CRYPTOCRITTERS</a>
      <div className="navbar">
        <button onClick={handleMarketplaceClick}>Marketplace</button>
        <button onClick={handleLeaderboardClick}>Leaderboard</button>
        <button onClick={handleHowToPlayClick}>How To Play</button>
        <button onClick={handleTeamClick}>Team</button>
        {isLoggedIn ? (
          <div className="nav-profile">
            <img
              src={userProfile?.avatar || profileIcon}
              alt="Profile"
              onClick={handleProfileClick}
              className="profile-icon"
            />
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="nav-login">
            <button onClick={handleJoinUsClick}>Login!</button>
          </div>
        )}
      </div>
      </div>
  );
};

export default Navbar;
