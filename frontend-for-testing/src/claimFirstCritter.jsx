import React, { useEffect } from 'react'
import Card from './card.jsx'
import { useState } from 'react'
import {ethers} from 'ethers'
import { ABI } from './nftABI.js'
import {connectMetamask} from '../utils/connectMetamask.js'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const ClaimFirstCritter = () => {

    //add page reload if metamask connect account changes
    //there is useeffect when page loads currently which captures current account keep in mind

    let [selectedCritterAddress, setselectedCritterAddress] = useState(null)
    let [critterOneData, setcritterOneData] = useState({})
    let [critterTwoData, setcritterTwoData] = useState({})
    let [critterThreeData, setcritterThreeData] = useState({})
    let [critterOneURI, setcritterOneURI] = useState(null)
    let [critter2URI, setcritter2URI] = useState(null)
    let [critter3URI, setcritter3URI] = useState(null)
    let [provider, setProvider] = useState(null);
    let [signer, setSigner] = useState(null);
    let[selectedCritterName,setselectedCritterName] = useState("None")
    let[selectedCritterImage,setselectedCritterImage] = useState(null)
    let[nickname,setNickname]=useState(null)
    let[connectedUserAddress,setconnectedUserAddress]=useState(null)
    let[claimStatus,setclaimStatus]=useState(null)
    let[type,setType]=useState(null)

    const formData = new FormData();
    
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const walletVerification = async()=>{
        const response = await axios.post('http://localhost:5000/api/v1/check/onSameWallet', { connectedAddress: walletAddress },{withCredentials:true});
        const { isValid } = response.data;

        if (!isValid) {
          console.log('Wallet address is not verified for this user.');
          return isValid;
        }
        return isValid
    }

    let[tokenId,setTokenId] = useState(null)
    
    const nftClaimTransaction = () => {
        if (connectedUserAddress) {
            if (walletVerification) {
                setTokenIDD()
            }
        }
    
    };
    let[formdataresponse,setformdataresponse] = useState(null)

    //data append in form
    useEffect(() => {
        if(tokenId>0){
            console.log("token id : ",tokenId)
            try {
                formData.append('address', selectedCritterAddress);
                formData.append('name', selectedCritterName);
                formData.append('critterImageUrl', selectedCritterImage);
                formData.append('tokenId', tokenId);  
                formData.append('type',type)
                if (nickname) {
                    formData.append('nickname', nickname);
                }
                console.log("Form Data Content: ", formDataToJSON(formData));
                setformDataJson(formDataToJSON(formData))
            } catch (error) {
                console.log("error is adding form data")
            }
        }
    }, [tokenId])

    let[formDataJson,setformDataJson] = useState(null)

    useEffect(()=>{
        if (formDataJson) {
                    setformdataresponse(true)
        }  
    },[formDataJson])

    useEffect(() => {
        if(formdataresponse){
            const response = addCritterDataInDatabase()
            if (response) {
                setclaimStatus(true)
            }
        }
      }, [formdataresponse])   


    useEffect(() => {
      if(claimStatus){
        navigate('/user/userProfile');
      }
    }, [claimStatus])
    
    

    const addCritterDataInDatabase = async ()=>{
        try {
            await axios.post("http://localhost:5000/api/v1/critter/claimFirstCritter",formDataJson,{withCredentials:true})
            return true
        }catch(error){
            console.log("cant add critterindatabase mssg from jsx",error)
        }
    }

    async function useMetamask(){
        const {connectedWalletAddress,provider,signer} = await connectMetamask()
        setProvider(provider);
        setconnectedUserAddress(connectedWalletAddress)
        setSigner(signer);
    }

      
    //start of claimFirst page
    useEffect(() => {
      useMetamask()
      setcritterOneURI("https://arweave.net/NX8bgt_tAInNCZBghiieHtorhmxTWvPXt4uaIfZsl8s")
      setcritter2URI("https://arweave.net/tIo5TyRdIfrALtOqD2wRx168ZAMBwEVVDBgr3nRtZFc")
      setcritter3URI("https://arweave.net/zO488RIiPYLNoYWESpOs53Ha5W7hnZ9LHpjK9IBnewA")
    },[])

    useEffect(() => {
        if (signer && provider) {
        fetchDataOne()
        fetchDataTwo()
        fetchDataThree()
        }
      }, [signer, provider]);

    async function fetchDataOne(){
        fetch(critterOneURI)
        .then((response)=>{
            return response.json()
        })
        .then((data)=>{
            console.log(data)
            setcritterOneData(data)
        })
    }
    async function fetchDataTwo(){
        fetch(critter2URI)
        .then((response)=>{
            return response.json()
        })
        .then((data)=>{
            setcritterTwoData(data)
        })
    }
    async function fetchDataThree(){
        fetch(critter3URI)
        .then((response)=>{
            return response.json()
        })
        .then((data)=>{
            setcritterThreeData(data)
        })
    }
    
    async function claimCritter(){
        if(typeof window.ethereum!="undefined"){
            const contract = new ethers.Contract(selectedCritterAddress.toString(),ABI,signer)
            try{
                const tx = await contract.claimNFT("0x3aAFbe8352e465461906cD2Cf12d4f4559968153")
                const receipt = await tx.wait(); 
                const tokenId = receipt.events[0].args.tokenId.toString(); 
                return tokenId
            }catch(error){
                console.log("Error in Claiming NFT on Blockchain",error)
            }
        }
    }

    async function setTokenIDD(){
        const tokenNumber = await claimCritter()
        setTokenId(tokenNumber)
    }

    //marketplace : 0x39f42213fB52cCA75b1BAc92e75741818342b822
    //claimNFTs : 0x04839f187cA780263b38dd87FeB44979877D8A4f

    const choseCritter1 = async()=>{
        setselectedCritterAddress("0x311259f6A324D4F1c10e06066275eb85726ACe9e")
        setselectedCritterName("Ignis Fox") 
        setselectedCritterImage(`${critterOneData.image}`)
        setType("fire")
    }
    const choseCritter2 = async()=>{
        setselectedCritterAddress("0x3383CB3Ff7E1EBC7793DE1415E941eE385e05417")
        setselectedCritterName("Serplet") 
        setselectedCritterImage(`${critterTwoData.image}`)
        setType("water")
    }
    const choseCritter3 = async()=>{
        setselectedCritterAddress("0x8137c5210D8e42AE82716c3e37566bc4b66F6536")
        setselectedCritterName("Leafkin Behemoth") 
        setselectedCritterImage(`${critterThreeData.image}`)
        setType("grass")
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
        const nicknameValue = e.currentTarget.elements.nickname.value
        setNickname(nicknameValue);
    }

    const formDataToJSON = (formData) => {
        const object = {};
        formData.forEach((value, key) => {
            object[key] = value;
        });
        return object;
    };

  return (
    <>
    <h2>Thank you for Registering in Game</h2>
    <h3>CHOOSE YOUR PARTNER</h3>
    
        <button onClick={choseCritter1}>Critter 1</button>
        <Card imageUrl={critterOneData.image} name={critterOneData["name"]} />

        <button onClick={choseCritter2}>Critter 2</button>
        <Card imageUrl={critterTwoData.image} name={critterTwoData["name"]}/>

        <button onClick={choseCritter3}>Critter 3</button>
        <Card imageUrl={critterThreeData.image} name={critterThreeData["name"]}/>
    
        <br></br>

        <form id="nicknameForm" onSubmit={handleSubmit}>
            <label htmlFor="nickname"> Nickname for your Critter (optional): </label>
            <input id="nickname" type='text' />
            <button type='submit'>Done</button>
        </form>
        {selectedCritterAddress&&(<>
            <h4>Choosed Critter : {selectedCritterName}</h4>
            <button onClick={nftClaimTransaction}>Confirm :  </button>
        </>)}
    </>
  )
}

export default ClaimFirstCritter