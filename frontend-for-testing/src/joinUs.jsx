import { useState } from 'react'
import axios from 'axios'
import { connectMetamask } from '../utils/connectMetamask'
import { useNavigate } from 'react-router-dom';


function JoinUs() {

  //claim your first nft page
  const navigate = useNavigate();
  const handleClaimNFT = () => {
    navigate('/user/register/claimFirstCritter');
  };


  const [registerStatus, setregisterStatus] = useState("Register")
  const [walletAddress, setwalletAddress] = useState("Null")
  const [walletConnectStatus,setwalletConnectStatus] = useState("Please Connect your Wallet")

  async function useMetamask(){
    const {connectedWalletAddress,provider,signer} = await connectMetamask()
    setwalletAddress(connectedWalletAddress)
    setwalletConnectStatus("Wallet Connected")
  }
  
  async function submitForm(e){
    e.preventDefault()

    if(walletConnectStatus=="Please Connect your Wallet"){
      console.log("Wallet Disconnected")
      return null
    }
    
    const formData = {
      username:`${e.target.username.value}`,
      password:`${e.target.password.value}`,
      displayName:`${e.target.displayName.value}`,
      walletAddress:`${walletAddress}`
    }
    try {
      await axios.post("http://localhost:5000/api/v1/user/register",formData)
      setregisterStatus("Registered")
    } catch (error) {
      console.log("registration failed",error)
    }
  }

  

  return (
    <div>
      <div>Join Us</div>
      <button onClick={useMetamask}>{walletConnectStatus}</button>
      <h3>Connected Address : {walletAddress}</h3>
      <form id='registrationForm' onSubmit={submitForm}>

        <label>Username</label>
        <input type='text'  id="username"></input>
        <br></br>
        <label>Choose Avatar</label>
        <input type='file'></input>
        <br></br>
        <label>password</label>
        <input type='text' id="password"></input>
        <br></br>
        <label>displayName</label>
        <input type='text' id="displayName"></input>
        <button onSubmit={submitForm}>{registerStatus}</button>
        <br></br>

      {registerStatus=="Registered" &&(
        <>
        <h3>Thank you for Registering in Game</h3>
        <p>Claim your first Critter</p>
        <button onClick={handleClaimNFT}>CLAIM</button>
        </>
      )}
       
        
      </form>
      
    </div>
  )
}

export default JoinUs
