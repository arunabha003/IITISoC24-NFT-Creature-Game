import React, { useEffect,useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [userData, setuserData] = useState({})
  const[logoutSuc,setlogoutSuc] = useState(null)

  //
  const navigate = useNavigate()

  const handleHomePage = () => {
    navigate('/homepage');
    };

  useEffect(() => {
      fetchUserProfile()
  },[])

  axios.defaults.withCredentials = true;


  async function fetchUserProfile(){
   const response =  await axios.get("http://localhost:5000/api/v1/user/profile",{withCredentials:true}) //include cookies in request
    setuserData(response.data)  
  }

  async function logout(){
    await axios.get("http://localhost:5000/api/v1/user/logout",{withCredentials:true})
    setlogoutSuc("done")
  }

  useEffect(() => {
    if(logoutSuc){
      handleHomePage()
    }
  }, [logoutSuc])
  
  return (
    <>
    {userData && (<> 
      <img src={userData.avatar} alt="Avatar" />
          <p>Username: {userData.username}</p>
          <p>Wallet Address: {userData.walletAddress}</p>
          <p>yahan your critters bhi add krna hoga yaa to seperate page is better just click bitch here</p>
          <p>Battles lost : </p>
    </>)}
    <br></br>
    <button onClick={logout}>Logout</button>
    </>
    
  )
}

export default UserProfile