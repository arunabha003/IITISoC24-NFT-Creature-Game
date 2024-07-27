import { useEffect,useState} from 'react'
import axios from 'axios'
import CritterCard from "../src/yourCritterCard.jsx"
import {connectMetamask} from '../utils/connectMetamask.js'
import Navbar from './Navbar.jsx'


const YourCritters = () => {

  let [connectedUserAddress, setconnectedUserAddress] = useState(null)
  let [allCritterData, setallCritterData] = useState(null)
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
        fetchData()
      }
    }
  },[connectedUserAddress])
  
  return (
    <>
    <Navbar />
        <h1>Your Critters !</h1>
        {allCritterData && (<>
          {allCritterData.map(critter => (
          <CritterCard key={critter._id} critter={critter} />
          ))}
        </>)}

    </>
  )
}

export default YourCritters