import { useState, useEffect } from 'react';
import axios from 'axios';
import { connectMetamask } from '../utils/connectMetamask';
import { useNavigate } from 'react-router-dom';
import Navbar from '../src/Navbar.jsx';

function JoinUs() {
  const navigate = useNavigate();

  const handleClaimNFT = () => {
    navigate('/user/register/claimFirstCritter');
  };

  const [registerStatus, setRegisterStatus] = useState("Register");
  const [walletAddress, setWalletAddress] = useState("Null");
  const [walletConnectStatus, setWalletConnectStatus] = useState("Please Connect your Wallet");

  useEffect(() => {
    if (registerStatus === "Registered") {
      handleClaimNFT();
    }
  }, [registerStatus]);

  async function useMetamask() {
    const { connectedWalletAddress } = await connectMetamask();
    setWalletAddress(connectedWalletAddress);
    setWalletConnectStatus("Wallet Connected");
  }

  async function submitForm(e) {
    e.preventDefault();

    if (walletConnectStatus === "Please Connect your Wallet") {
      console.log("Wallet Disconnected");
      return null;
    }

    const formData = new FormData();
    formData.append('username', e.target.username.value);
    formData.append('password', e.target.password.value);
    formData.append('displayName', e.target.displayName.value);
    formData.append('walletAddress', walletAddress);
    formData.append('avatar', e.target.avatar.files[0]);

    try {
      await axios.post("http://localhost:5000/api/v1/user/register", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setRegisterStatus("Registered");
    } catch (error) {
      console.log("registration failed", error);
    }
  }

  return (
    <div className="join-us-container">
      <Navbar />
      <div className="join-us-content">
        <h2>Join Us</h2>
        <button onClick={useMetamask} className="connect-wallet-button">{walletConnectStatus}</button>
        <h4>Connected Address: {walletAddress}</h4>
        <form id="registrationForm" onSubmit={submitForm} encType="multipart/form-data" className="registration-form">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" required />
          <label htmlFor="avatar">Choose Avatar</label>
          <input type="file" id="avatar" name="avatar" required />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
          <label htmlFor="displayName">Display Name</label>
          <input type="text" id="displayName" name="displayName" required />
          <button type="submit" className="register-button">{registerStatus}</button>
        </form>
      </div>
    </div>
  );
}

export default JoinUs;
