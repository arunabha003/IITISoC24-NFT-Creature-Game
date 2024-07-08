import React, { useEffect } from 'react'
import Card from './card.jsx'
import { useState } from 'react'
import {ethers} from 'ethers'
import { ABI } from './nftABI.js'
import {connectMetamask} from '../utils/connectMetamask.js'
import { useNavigate } from 'react-router-dom';

const ClaimFirstCritter = () => {

    const navigate = useNavigate();
    
    const handleUserProfile = () => {
    navigate('/user/userProfile');
    };

    let [selectedCritter, setselectedCritter] = useState("")
    let [critterOneData, setcritterOneData] = useState({})
    let [critterTwoData, setcritterTwoData] = useState({})
    let [critterThreeData, setcritterThreeData] = useState({})
    let [critterOneURI, setcritterOneURI] = useState(null)
    let [critter2URI, setcritter2URI] = useState(null)
    let [critter3URI, setcritter3URI] = useState(null)
    let [provider, setProvider] = useState(null);
    let [signer, setSigner] = useState(null);
    let[selectedCritterName,setselectedCritterName] = useState("None")

    async function useMetamask(){
        const {connectedWalletAddress,provider,signer} = await connectMetamask()
        setProvider(provider);
        setSigner(signer);
    }

    const getURIOne= async()=>{
        const oneURI = await getURI("0x5a8d131cdf5502b28D34FE504f846A2F14C52c40")
        console.log(oneURI)
        setcritterOneURI(oneURI)
    }
    const getURI2= async()=>{
        const twoURI = await getURI("")
        console.log(twoURI)
        setcritter2URI(twoURI)
    }
    const getURI3= async()=>{
        const threeURI = await getURI("")
        console.log(threeURI)
        setcritter3URI(threeURI)
    }
      
    //start of claimFirst page
    useEffect(() => {
      useMetamask()
    },[])

    useEffect(() => {
        if (signer && provider) {
          getURIOne()
          getURI2()
          getURI3()

        }
      }, [signer, provider]);

    useEffect(() => {
        if(critterOneURI){
            fetchDataOne(critterOneURI)
        }
        if(critter2URI){
            fetchDataTwo(critter2URI)
        }
        if(critter3URI){
            fetchDataThree(critter3URI)
        }
    }, [critterOneURI]);

    async function fetchDataOne(e){
        fetch(e)
        .then((response)=>{
            return response.json()
        })
        .then((data)=>{
            setcritterOneData(data)
        })
    }
    async function fetchDataTwo(e){
        fetch(e)
        .then((response)=>{
            return response.json()
        })
        .then((data)=>{
            setcritterTwoData(data)
        })
    }
    async function fetchDataThree(e){
        fetch(e)
        .then((response)=>{
            return response.json()
        })
        .then((data)=>{
            setcritterThreeData(data)
        })
    }
    

    async function getURI(ContractAddress){
        if(typeof window.ethereum!="undefined"){
            const contract = new ethers.Contract(ContractAddress.toString(),ABI,signer)
            try{
                let _tokenURI = await contract.TOKEN_URI()
                return _tokenURI
            }catch(error){
                console.log(error)
            }
        }
    }
    const choseCritter1 = async()=>{
        setselectedCritter("0x5a8d131cdf5502b28D34FE504f846A2F14C52c40")
        setselectedCritterName("Ignis Fox") 
    }
    const choseCritter2 = async()=>{
        setselectedCritter("")
        setselectedCritterName("Serplet") //ignisFox
    }
    const choseCritter3 = async()=>{
        setselectedCritter("")
        setselectedCritterName("Leafkin Behemoth") //ignisFox
    }


  return (
    <>
    <h3>CHOOSE YOUR PARTNER</h3>
    
        <button onClick={choseCritter1}>Critter 1</button>
        <Card imageUrl={critterOneData.image} name={critterOneData["name"]} />

        <button onClick={choseCritter2}>Critter 2</button>
        <Card imageUrl={critterTwoData.image} name={critterTwoData["name"]}/>

        <button onClick={choseCritter3}>Critter 3</button>
        <Card imageUrl={critterThreeData.image} name={critterThreeData["name"]}/>
    
        <br></br>
        <h4>Choosed Critter : {selectedCritterName}</h4>
        <button onClick={handleUserProfile}>Confirm </button>
    </>
  )
}

export default ClaimFirstCritter