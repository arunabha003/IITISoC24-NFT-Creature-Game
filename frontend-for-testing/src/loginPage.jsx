import React, { useState, useEffect } from 'react';
import { connectMetamask } from '../utils/connectMetamask';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../src/AuthContext.jsx';
import Navbar from '../src/Navbar.jsx';

const LoginPage = () => {
  axios.defaults.withCredentials = true;

  const [walletAddress, setWalletAddress] = useState('Null');
  const [walletConnectStatus, setWalletConnectStatus] = useState('Please Connect your Wallet');
  const [status, setStatus] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const useMetamask = async () => {
    const { connectedWalletAddress } = await connectMetamask();
    setWalletAddress(connectedWalletAddress);
    setWalletConnectStatus('Wallet Connected');
  };

  const submitLoginForm = async (e) => {
    e.preventDefault();
    const data = {
      password: e.target.password.value,
      walletAddress: walletAddress,
    };

    try {
      await axios.post('http://localhost:5000/api/v1/user/login', data, { withCredentials: true });
      setStatus('Logged in successfully');
      login({walletAddress})
    } catch (error) {
      alert('User does not exist, please register');
      navigate('/');
    }
  };

  const handleUserProfile = () => {
    navigate('/user/userProfile');
  };

  useEffect(() => {
    if (status) {
      handleUserProfile();
    }
  }, [status]);

  return (
    <>
      <Navbar />
      <h2>Login</h2>
      <button onClick={useMetamask}>{walletConnectStatus}</button>
      <h4>Account Wallet Address: {walletAddress}</h4>

      <form id="loginForm" onSubmit={submitLoginForm}>
        <label>Enter Password of Account: </label>
        <input type="password" id="password" required />
        <button type="submit">Login</button>
      </form>

      <p>
        New to Crypto Critters? <a href="/user/register">Register</a>
      </p>
    </>
  );
};

export default LoginPage;
