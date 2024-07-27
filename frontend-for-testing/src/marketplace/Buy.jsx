import React,{useEffect,useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import CritterCard from '../yourCritterCard';
import { ABI } from '../nftABI';
import {ethers} from "ethers"
import { connectMetamask } from '../../utils/connectMetamask';
import { marketplaceABI } from './marketplaceABI';
import Navbar from '../Navbar.jsx'

const Buy = () => {
    const navigate = useNavigate()

    axios.defaults.withCredentials = true;

    const [allCritterData, setallCritterData] = useState(null)
    const [connectedUserAddress, setConnectedUserAddress] = useState(null);
    const [signer, setSigner] = useState(null);
    const [provider, setprovider] = useState(null);
    const [balance, setBalance] = useState(null);
    const [prices, setprices] = useState({});
    const [walletVerified, setWalletVerified] = useState(false);
    const [transactionCompletion,settransactionCompletion] = useState(null)
    

    const fetchData = async()=>{
        const fetched = await axios.get("http://localhost:5000/api/v1/critter/fetchCrittersForSale",{withCredentials:true})
        setallCritterData(fetched.data)
    }

    async function useMetamask() {
        const { connectedWalletAddress,provider ,signer } = await connectMetamask();
        setSigner(signer);
        setprovider(provider)
        setConnectedUserAddress(connectedWalletAddress);
    }
    
    const removeData = async(critterId)=>{
      try {
        await axios.post("http://localhost:5000/api/v1/critter/unListItem",
          {
            id:critterId
          }
          ,{withCredentials:true})
      } catch (error) {
        console.log(error)
      }
  }

    useEffect(() => {
      fetchData()
      useMetamask()
    }, [])

    useEffect(() => {
      if(allCritterData){
        for(const critter of allCritterData){
            const critterId = critter._id
            fetchPriceOfListedNFT(critter.tokenAddress,critter.tokenId,critterId)
        }
      }
    }, [allCritterData])
    
      useEffect(() => {
        if (connectedUserAddress) {
          if (walletVerification()) {
            getBalanceOfConnectedAccount()
            setWalletVerified(true)
          } else {
            alert("Stick to the same wallet address as per the connected profile");
          }
        }
    }, [connectedUserAddress]);
    
      // Function to verify wallet
      const walletVerification = async () => {
        const response = await axios.post('http://localhost:5000/api/v1/check/onSameWallet', { connectedAddress: connectedUserAddress }, { withCredentials: true });
        const { isValid } = response.data;
    
        if (!isValid) {
          console.log('Connect same wallet as of the user');
          return false;
        }
        return true;
    };
 
    const sellYourCritter = ()=>{
        navigate('/sellYourCritter')
    }

    async function fetchPriceOfListedNFT(nftaddress, tokenId,critterId) {
        if (window.ethereum !== 'undefined') {
          const contract = new ethers.Contract(nftaddress.toString(), ABI, signer);
          try {
            const priceInEth = await contract.fetchPriceOfListedNFT(tokenId);
            const priceInEthToString =  priceInEth.toString();
            setprices((prev)=>({
                ...prev,
                [critterId]:{
                    price:priceInEthToString
                }
            }))
          } catch (error) {
            console.log("Connect Metamask",error);
          }
        }
        else{
          console.log("Connect to the same wallet : Buy Function")
        }
    }

    async function getBalanceOfConnectedAccount(){
      const bal  = await provider.getBalance(connectedUserAddress)
      const balanceInEther = ethers.utils.formatEther(bal);
      const roundedBalance = parseFloat(balanceInEther).toFixed(3);
      setBalance(roundedBalance) 
    }

    //marketplace : 
    async function buyItem(NFTAddress, tokenId, critterId, priceInEther) {
      console.log(priceInEther)
      if (walletVerified) {
        if (await walletVerification()) {
          if (window.ethereum !== 'undefined') {
            const contract = new ethers.Contract("0xc0966dff235C4cf11fd5c39A68da29f46b9eBB67", marketplaceABI, signer);
            try {
              if (!priceInEther || isNaN(priceInEther)) {
                throw new Error("Invalid price in Ether");
              }
              console.log(ethers.utils.parseEther(priceInEther))
              const tx = await contract.buyItem(NFTAddress, tokenId, {
                value: ethers.utils.parseEther(priceInEther)/1e18,
                gasLimit: 1000000 // Convert the price to the correct format
              });
              const receipt = await tx.wait();
              await removeData(critterId);
              settransactionCompletion(true);
              return true;
            } catch (error) {
              console.log("Connect Metamask", error);
            }
          }
        } else {
          console.log("wallet verification failed during buying");
        }
      }
    }

    async function purchaseCritters(){
      navigate('/purchaseCritters')
    }
    
    

    return (
        <div>
          <Navbar />
            Connected Address : {connectedUserAddress}
            <br></br>
            <button onClick={sellYourCritter}>Sell your Critter</button>
            <button onClick={purchaseCritters}>Purchase Critters</button>
            <br></br> 
            Balance : {balance}
            <br></br>
            {allCritterData && (
                allCritterData.map(critter => (
                    <div key={critter._id}>
                        <CritterCard critter={critter} />
                        <p>Price In Ethers : {prices[critter._id]?.price ?? "Connect Metamask!"}
                            <button onClick={()=>(buyItem(critter.tokenAddress.toString(),critter.tokenId,critter._id,prices[critter._id].price))}>Buy</button>
                        </p>
                    </div>
                ))
            )}
        </div>
    )
}

export default Buy