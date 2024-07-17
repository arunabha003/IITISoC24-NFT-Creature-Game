import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Results = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const location = useLocation();
  const { status, EXP, winnerUsername, loserUsername } = location.state;


  const [data, setData] = useState({
    winnerUsername: '',
    loserUsername: ''
  });


  useEffect(() => {

    return () => {
      // Clear session storage when the component unmounts
      sessionStorage.removeItem('reloaded');
    };
  }, [])

  
  
  useEffect(() => {
    const addExp = async () => {
      try {
        await axios.post('http://localhost:5000/api/v1/user/addEXP', { EXP }, { withCredentials: true });
        console.log("exp added");
      } catch (error) {
        console.log('Error in adding exp in User Model', error);
      }
    };
    // Check if the page was reloaded by checking session storage
    if (sessionStorage.getItem('reloaded')) {
      navigate('/');
    } else {
      addExp()
      sessionStorage.setItem('reloaded', 'true');
    }

    setData({
      winnerUsername,
      loserUsername
    });
  }, [navigate, winnerUsername, loserUsername]);

  const addBattleRecord = async () => {
    try {
      
        await axios.post('http://localhost:5000/api/v1/battleRecords/addBattleRecord', data, { withCredentials: true });
        console.log("data added");
      
    } catch (error) {
      console.log('Error in adding data in Battle Record', error);
    }
  };


  useEffect(() => {
    if (data.winnerUsername && data.loserUsername) {
      addBattleRecord();
    }
  }, [data]);

  const handle = async () => {
    sessionStorage.removeItem('reloaded');
    navigate('/');
  };

  return (
    <>
      {status === 'won' && (
        <>
          <h1>VICTORY</h1>
          <br />
          <p>Rewards: {EXP} exp</p>
          <button onClick={handle}>Go Home</button>
        </>
      )}
      {status === 'lost' && (
        <>
          <h1>Defeat</h1>
          <p>Better luck next time...</p>
          <br />
          <p>Rewards: {EXP} exp</p>
          <button onClick={handle}>Go Home</button>
        </>
      )}
    </>
  );
};

export default Results;
