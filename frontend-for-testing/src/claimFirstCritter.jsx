import React, { useEffect } from 'react'
import Card from './card.jsx'
import { useState } from 'react'
import {ethers} from 'ethers'
import { ABI } from './ignisFoxABI.js'
import {connectMetamask} from '../utils/connectMetamask.js'

const ClaimFirstCritter = () => {

    let [selectedCritter, setselectedCritter] = useState("null")
    let [critterOneURI, setcritterOneURI] = useState(null)
    let [critterOneData, setcritterOneData] = useState({})
    let [provider, setProvider] = useState(null);
    let [signer, setSigner] = useState(null);


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
      
    //start of claimFirst page
    useEffect(() => {
      useMetamask()
    },[])

    useEffect(() => {
        if (signer && provider) {
          getURIOne()
        }
      }, [signer, provider]);

    useEffect(() => {
        if(critterOneURI){
            fetchData(critterOneURI)
        }
    }, [critterOneURI]);

    async function fetchData(e){
        fetch(e)
        .then((response)=>{
            return response.json()
        })
        .then((data)=>{
            setcritterOneData(data)
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
        setNFTContractAddress("0x5a8d131cdf5502b28D34FE504f846A2F14C52c40") //ignisFox
    }
    const choseCritter2 = async()=>{

    }
    const choseCritter3 = async()=>{

    }


  return (
    <>
    <h3>CHOOSE YOUR PARTNER</h3>
    
        <button onClick={choseCritter1}>Critter 1</button>
        <Card imageUrl={critterOneData.image} name={critterOneData["name"]} />
        <button>Critter 2</button>
        <Card/>
        <button>Critter 3</button>
        <Card/>
    
    </>
  )
}

export default ClaimFirstCritter