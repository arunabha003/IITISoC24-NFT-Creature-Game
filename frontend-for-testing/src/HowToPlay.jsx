import React from 'react'
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const HowToPlay = () => {
  const navigate = useNavigate();

  const handleClaimNFT = () => {
    navigate('/user/register/claimFirstCritter');
  };

  return (
    <>
      <Navbar />
      <div>How To Play</div>
      <button onClick={handleClaimNFT}>Claim First Contract</button>
    </>
  )
}

export default HowToPlay;
