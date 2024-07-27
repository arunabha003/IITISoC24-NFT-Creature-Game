import { useState, useEffect } from "react";
// import "./App.css";
import { ethers } from "ethers";
import { ABIPF } from "./NFTABI";

const Sylvan = () =>
  //   {
  //   Signer,
  //   NFTContractAddress,
  //   tokenID,
  //   price,
  //   TokenURI,
  //   onBuy,
  // }
  {
    let [NFTContractAddress, setNFTContractAddress] = useState(
      "0xA015b3B2114671051dEeB6eC9aCB41EAaD4Dc44A"
    );
    let [Signer, setSigner] = useState();
    let [TokenURI, setTokenURI] = useState(
      "https://arweave.net/tKl1V6qmqDMgnroz1x-Z9BRM_ojQxgSPc1uuYGh8fF4"
    );
    const [nftData, setNftData] = useState(null);
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
            ABIPF,
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
        const contract = new ethers.Contract(NFTContractAddress, ABIPF, Signer);
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
        const contract = new ethers.Contract(NFTContractAddress, ABIPF, Signer);
        try {
          let tx = await contract.purchaseNFT({
            value: ethers.utils.parseEther("0.003"),
          });
          await tx.wait();
          alert("Purchase successful!"); // await listenForTransactionMine(transactionResponse, Provider)
        } catch (error) {
          console.log(error);
        }
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
        <p>Price: 0.003 Ether</p>
        <button
          onClick={purchase}
          className="buy-button border border-slate-700 p-2 mt-2"
        >
          Buy
        </button>
      </div>
    );
  };

export default Sylvan;
