import { useState, useEffect } from "react";
// import "./App.css";
import { ethers } from "ethers";
import { ABIIF } from "./NFTABI";

const Ignisfox = () =>
  //   {
  //   Signer,
  //   NFTContractAddress,
  //   tokenID,
  //   price,
  //   TokenURI,
  //   onBuy,
  // }
  {
    let [name, setName] = useState("CritterName");
    let [description, setDescription] = useState("description");
    let [image, setimage] = useState(
      "https://arweave.net/D6uDf4EVHgTY5G8tfkwYbwgie4jtbCvqAT15mjZ-GdU"
    );
    const [myArray, setMyArray] = useState([]);
    let [type, settype] = useState();
    let [SignatureMove, setSignatureMove] = useState();
    let [AttackPower, setAttackPower] = useState();
    let [AscendedStage, setAscendedStage] = useState();
    let [NFTContractAddress, setNFTContractAddress] = useState(
      "0x311259f6A324D4F1c10e06066275eb85726ACe9e"
    );
    let [ConnectStatus, setConnectStatus] = useState("Not Connected");
    let [Provider, setProvider] = useState();
    let [Signer, setSigner] = useState();
    let [TokenURI, setTokenURI] = useState(
      "https://arweave.net/NX8bgt_tAInNCZBghiieHtorhmxTWvPXt4uaIfZsl8s"
    );
    let [TokenIDArray, setTokenIDArray] = useState();
    let [tokenData, setTokenData] = useState(null);
    let [connectedAccount, setConnectedAccount] = useState();
    let [inputTokenID, setInputTokenID] = useState();
    let [owned, setOwned] = useState(false);
    let [tokenidlength, settokenidlength] = useState(0);
    let [tokenid, settokenid] = useState(0);
    let [listedArray, setlistedArray] = useState([]);
    let [PriceArray, setPriceArray] = useState([]);
    const [nftData, setNftData] = useState(null);
    const [level, setLevel] = useState(null);
    useEffect(() => {
      async function fetchNftData() {
        try {
          const response = await fetch(TokenURI);
          const data = await response.json();
          console.log(data);
          setNftData(data);
        } catch (error) {
          console.error("Error fetching NFT data:", error);
        }
      }
      async function getURI() {
        console.log(NFTContractAddress);
        if (typeof window.ethereum != "undefined") {
          const contract = new ethers.Contract(
            NFTContractAddress,
            ABIIF,
            Signer
          );
          try {
            let _TokenURI = await contract.TOKEN_URI();
            console.log(_TokenURI);

            setTokenURI(_TokenURI); //it takes time
            // await listenForTransactionMine(transactionResponse,Provider)
          } catch (error) {
            console.log(error);
          }
        }
      }
      getURI();
      fetchNftData();
    }, []);

    async function getURI() {
      console.log(NFTContractAddress);
      if (typeof window.ethereum != "undefined") {
        const contract = new ethers.Contract(NFTContractAddress, ABIIF, Signer);
        try {
          let _TokenURI = await contract.TOKEN_URI();
          setTokenURI(_TokenURI); // it takes time
          console.log(_TokenURI);
          // await listenForTransactionMine(transactionResponse, Provider)
        } catch (error) {
          console.log(error);
        }
      }
    }
    async function purchase() {
      if (typeof window.ethereum != "undefined") {
        const contract = new ethers.Contract(NFTContractAddress, ABIIF, Signer);
        try {
          let tx = await contract.purchaseNFT({
            value: ethers.utils.parseEther("0.001"),
          });
          await tx.wait();
          alert("Purchase successful!"); // await listenForTransactionMine(transactionResponse, Provider)
        } catch (error) {
          console.log(error);
        }
      }
    }
    async function connectMetamask() {
      if (typeof window.ethereum !== "undefined") {
        try {
          await ethereum.request({ method: "eth_requestAccounts" });
          setConnectStatus("Connected");
          let _provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(_provider); //it takes time
          let _signer = _provider.getSigner();
          setSigner(_signer);
          console.log(Signer);
          console.log(Provider);
        } catch (error) {
          console.log(error);
        }
        const accounts = await ethereum.request({ method: "eth_accounts" });
        setConnectedAccount(accounts[0]);
        console.log(accounts[0]);
      } else {
        alert("Install Metamask");
      }
    }

    return (
      <div className="nft-card">
        {nftData ? (
          <>
            <img
              src={nftData.image}
              alt={nftData.name}
              className="nft-image w-full h-auto rounded-md"
            />
            <div className="nft-info mt-2">
              <h1>{nftData.name}</h1>
              <p>Description:{nftData.description}</p>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
        <p>Price: 0.001 Ether</p>
        <button
          onClick={purchase}
          className="buy-button border border-slate-700 p-2 mt-2"
        >
          Buy
        </button>

        <button
          id="connectMetamask"
          className="border border-slate-700  "
          onClick={connectMetamask}
        >
          {ConnectStatus}
        </button>
      </div>
    );
  };

export default Ignisfox;
