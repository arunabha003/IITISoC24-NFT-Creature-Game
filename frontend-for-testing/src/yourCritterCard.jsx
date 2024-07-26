import React from 'react';
import  "../src/App.css"

const CritterCard = ({ critter }) => {

  return (
    <div className="card">
      <img src={critter.critterImageUrl} className="card-img-top" alt={critter.name} />
      <div className="card-body">
        <h5 className="card-title">{critter.name}</h5>
        <p className="card-text">Token ID: {critter.tokenId}</p>
        <p className="card-text">Nickname: {critter.nickname}</p>
      </div>
    </div>
  );
};

export default CritterCard;
