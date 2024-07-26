import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../src/Navbar.jsx';
import { useAuth } from './AuthContext';

const UserProfile = () => {
  const [userData, setUserData] = useState({});
  const [logoutSuc, setLogoutSuc] = useState(null);
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleHomePage = () => {
    navigate('/');
  };

  const handleYourCrittersPage = () => {
    navigate('/yourCritters');
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  axios.defaults.withCredentials = true;

  async function fetchUserProfile() {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/user/profile', { withCredentials: true });
      setUserData(response.data);
      login(response.data);
    } catch (error) {
      console.error('Error fetching user profile', error);
    }
  }

  async function handleLogout() {
    try {
      await axios.get('http://localhost:5000/api/v1/user/logout', { withCredentials: true });
      setLogoutSuc('done');
      logout()
    } catch (error) {
      console.error('Error logging out', error);
    }
  }

  useEffect(() => {
    if (logoutSuc) {
      handleHomePage();
    }
  }, [logoutSuc]);

  return (
    <>
      <Navbar />
      {userData && (
        <>
          <img src={userData.avatar} alt="Avatar" />
          <p>Username: {userData.username}</p>
          <p>Wallet Address: {userData.walletAddress}</p>
          <p>Battles Won : {userData.battlesWon}</p>
          <p>Battles lost : {userData.battlesLost}</p>
          <p>Your Critters : <button onClick={handleYourCrittersPage}>CLICK</button></p>
        </>
      )}
      <br />
      <br />
      <button onClick={handleLogout}>Logout</button>
    </>
  );
};

export default UserProfile;
