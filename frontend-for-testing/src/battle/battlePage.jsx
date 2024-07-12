import { useEffect,useState} from 'react'
import CritterCard from "../yourCritterCard.jsx"
import {connectMetamask} from '../../utils/connectMetamask.js'
import io from 'socket.io-client'

import axios from 'axios'
const BattlePage = () => {

  //level add krna h in data
  //type add krna h 
  
  const socket = io("http://localhost:5001",{
    withCredentials: true,
    extraHeaders: {
        "Access-Control-Allow-Origin": "http://localhost:5173"
    }
  })

  socket.on('connect',(res)=>{
    console.log('Connected')
  })

  let[sendFighterInfoStatus,setsendFighterInfoStatus] = useState(null)

  const [userData, setuserData] = useState({})
  let [fighterInfo, setfighterInfo] = useState(null)
  let [connectedUserAddress, setconnectedUserAddress] = useState(null)
  let [allCritterData, setallCritterData] = useState(null)
  let [startMatch,setstartMatch] = useState("Fight!")
  axios.defaults.withCredentials = true;

  async function useMetamask(){
    const {connectedWalletAddress} = await connectMetamask()
    setconnectedUserAddress(connectedWalletAddress)
  }
  
  const walletVerification = async()=>{
    const response = await axios.post('http://localhost:5000/api/v1/check/onSameWallet', { connectedAddress: connectedUserAddress },{withCredentials:true});
    const { isValid } = response.data;

    if (!isValid) {
      console.log('Connect same wallet as of the user');
      return isValid;
    }
    return isValid
  }

  async function fetchUserProfile(){
    const response =  await axios.get("http://localhost:5000/api/v1/user/profile",{withCredentials:true}) //include cookies in request
    setuserData(response.data)  
   }

  const fetchData = async()=>{
    const fetched = await axios.get("http://localhost:5000/api/v1/critter/fetchCritters",{withCredentials:true})
    setallCritterData(fetched.data) // fetched.data this gives array of objects with each critter //console fetched it shows various like response n all due to axios
    // [
    //   {
    //     _id...
    //   },{}
    // ]
    console.log(fetched.data)
  }
  useEffect(()=>{
    useMetamask()
  },[])

  useEffect(()=>{
    if(connectedUserAddress){
      if(walletVerification()){
        fetchUserProfile()
        fetchData()
      }
      else{
        console.log("connect on same wallet")
      }
    }   
  },[connectedUserAddress])

  async function handleSubmit(critter){
    setfighterInfo({...critter,...userData})
    setsendFighterInfoStatus("sending")
  }  
  
  useEffect(() => {
    if(sendFighterInfoStatus="sending"){
      socket.emit('fighterInfo',fighterInfo)
    }
  }, [sendFighterInfoStatus])
  

  const matchmaking = async (e)=>{
    if (fighterInfo) {
      setstartMatch("Matchmaking...")
      //listens for match found even 
      socket.once('matchFound', ({ roomId }) => {
        // Redirect to battleground page
        navigate(`/battleground-${roomId}`);
      });
    }
    else{
      e.preventDefault()
      alert("Select Critter to Match With")
    }
  }

  return (
    <>
      Battle Now!
      <br></br>
      <div>
        <h1>Your Critters !</h1>
        {allCritterData && (
        <>
          {allCritterData.map(critter => (
            <div key={critter._id}> {/* Add key prop here */}
              <CritterCard critter={critter} /> {/* Move key prop to CritterCard */}
              <button onClick={() => handleSubmit(critter)}>Select</button> {/* Move key prop to button */}
            </div>
          ))}
        </>
      )}
        <button onClick={matchmaking}>{startMatch}</button>
      </div>
    </>
  )
}

export default BattlePage