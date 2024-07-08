import React from 'react';

const Card = ({ imageUrl, name, content }) => {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '16px',
      marginBottom: '16px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
    }}>
      <div style={{
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
      }}>
        <img
          src={imageUrl}
          alt={name}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            marginRight: '8px',
          }}
        />
        <h2 style={{ margin: 0,color:'black' }}>{name}</h2>
      </div>
      <p>{content}</p>
    </div>
  );
};

export default Card;
