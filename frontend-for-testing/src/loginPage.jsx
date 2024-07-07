import {useState} from 'react'
import { connectMetamask } from '../utils/connectMetamask'
import axios from 'axios'


const LoginPage = () => {
    const [walletAddress, setwalletAddress] = useState("Null")
    const [walletConnectStatus,setwalletConnectStatus] = useState("Please Connect your Wallet")
    async function useMetamask(){
        const {connectedWalletAddress} = await connectMetamask()
        setwalletAddress(connectedWalletAddress)
        setwalletConnectStatus("Wallet Connected")
      }
    async function submitLoginForm(e){
        e.preventDefault()
        const data = {
            password:`${e.target.password.value}`,
            walletAddress:walletAddress
        }
        try {
            await axios.post('http://localhost:5000/api/v1/user/login',data)
            
        } catch (error) {
            console.log("login error",error)
        }
    }
  return (
    <>
        <h2>Login</h2>
        <button onClick={useMetamask}>{walletConnectStatus}</button>
        <h4>Account Wallet Address : {walletAddress}</h4>

        <form id='loginForm' onSubmit={submitLoginForm}>
            <label>Enter Password of Account : </label>
            <input type='text' id='password'></input>
            <button type='submit'></button>
        </form>
    </>
  )
}

export default LoginPage