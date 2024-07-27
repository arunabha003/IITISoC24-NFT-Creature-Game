import React from 'react';
import '../src/nftCard.css'

const CritterCard = ({ critter }) => {

  return (
    <div className="nft-card">
      <img src={critter.critterImageUrl} className="nft-image w-full h-auto rounded-md" alt={critter.name} />
      <div className="nft-info mt-2">
        <h5 className="card-title">{critter.name}</h5>
        <p className="card-text">Token ID: {critter.tokenId}</p>
        <p className="card-text">Nickname: {critter.nickname}</p>
      </div>
    </div>
  );
};

export default CritterCard;
