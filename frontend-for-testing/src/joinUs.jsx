import { useState } from 'react'
import axios from 'axios'

function JoinUs() {
  const [registerStatus, setregisterStatus] = useState("Register")
  async function submitForm(e){

    e.preventDefault()
  
    const formData = {
      username:`${e.target.username.value}`,
      password:`${e.target.password.value}`,
      displayName:`${e.target.displayName.value}`,
      walletAddress:`${e.target.walletAddress.value}`
    }
    try {
      await axios.post("http://localhost:5000/api/v1/user/register",formData)
      setregisterStatus("Registered : Now please login")
    } catch (error) {
      console.log("registration failed",error)
    }
  }

  return (
    <div>
      <div>Join Us</div>
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
        <br></br>
        <label>walletAddress</label>
        <input type='text' id="walletAddress"></input>
        <button onSubmit={submitForm}>{registerStatus}</button>
      </form>
      
    </div>
  )
}

export default JoinUs
