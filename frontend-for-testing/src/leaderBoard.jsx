import React,{useEffect,useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState(null);
    
    const fetchLeaderboardData = async()=>{
        try {
            await axios.get('http://localhost:5000/api/v1/user/leaderboard')
            .then(response => {
                setLeaderboardData(response.data);
                console.log(response)
            })
            .catch(error => {
                console.error('Error fetching leaderboard data:', error);
            });
        } catch (error) {
            console.log("error fetching leaderboard")
        }
    }

    useEffect(() => {
        // Fetch leaderboard data from the server
        fetchLeaderboardData()
    }, []);
    return (
        <>
        <Navbar />
        {leaderboardData && (
            <>
            <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((user, index) => (
            <tr key={user.username}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.EXP}</td>
            </tr>
          ))}
        </tbody>
      </table> 
        </>
    )}
    </>
    )
}

export default Leaderboard