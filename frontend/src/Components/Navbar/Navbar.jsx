import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleJoinUsClick = () => {
    navigate('/join-us');
  };

  const handleMarketplaceClick = () => {
    navigate('/marketplace');
  };

  const handleYourCrittersClick = () => {
    navigate('/your-critters');
  };

  const handleInformationClick = () => {
    navigate('/information');
  };

  const handleContactUsClick = () => {
    navigate('/contact-us');
  };

  const handleAnnouncementsClick = () => {
    navigate('/announcements');
  };
  const handleHomeClick = () => {
    navigate('/home');
  };
  const handleBattleNow=()=>{
    navigate('/battle');
  };


  return (
    <header>
      <div className="logo">CRYTPTOCRITTERS</div>
      <div className="navbar">
        <div className="nav-login">
          <button onClick={handleJoinUsClick}>JOIN US</button>
        </div>
        <div className="marketplace">
          <button onClick={handleMarketplaceClick}>Marketplace</button>
        </div>
        <div className="yourCritters">
          <button onClick={handleYourCrittersClick}>Your Critters</button>
        </div>
        <div className="information">
          <button onClick={handleInformationClick}>Information</button>
        </div>
        <div className="contact-us">
          <button onClick={handleContactUsClick}>Contact Us</button>
        </div>
        <div className="announcements">
          <button onClick={handleAnnouncementsClick}>Announcements</button>
        </div>
        <div className="home">
          <button onClick={handleHomeClick}>Home</button>
        </div>
        <div className="battlenow">
          <button onClick={handleBattleNow}>Battle-Now</button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

