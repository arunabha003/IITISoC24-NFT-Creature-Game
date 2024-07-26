import React from 'react';
import { useNavigate } from 'react-router-dom';
// import './App.css';
import Navbar from './Navbar.jsx';
import grass from './Components/Assets/grass-3.jpg';
import fire from './Components/Assets/blazehound.jpg';
import water from './Components/Assets/Hydraconda.jpg';

const App = () => {
    const navigate = useNavigate();

    const handleBattleNow = () => {
       navigate('/battlepage');
    };

    return (
        <div className="fixed-background">
            <div className='.home-container'>
                <Navbar />
                <section className="hero">
                    <h1 className="hero-title">Discover Digital Art and Collect NFTs</h1>
                    <p className="hero-subtitle">Explore our exclusive NFT collection and join the battle today!</p>
                    <div className="nft-collection">
                        <div className="nft-card">
                            <img src={grass} alt="Grass NFT" />
                            <h2>Sylivian Collosus</h2>
                            <p>Rare and mystical, this NFT represents the mythical grass titan of ancient lore.</p>
                            <button>Buy Now</button>
                        </div>
                        <div className="nft-card">
                            <img src={fire} alt="Fox NFT" />
                            <h2>Ignis Fox</h2>
                            <p>Embodying the fiery spirit of the fox, this NFT is perfect for those who crave adventure.</p>
                            <button>Buy Now</button>
                        </div>
                        <div className="nft-card">
                            <img src={water} alt="Dragon NFT" />
                            <h2>HydroConda</h2>
                            <p>The ultimate water dragon NFT that channels the power of the ocean's depths.</p>
                            <button>Buy Now</button>
                        </div>
                    </div>
                </section>
                <section className="game-description">
                    <h2>Game Description</h2>
                    <p>Immerse yourself in an epic battle game where your NFTs become your ultimate weapons. Collect and battle your way to glory!</p>
                    <button onClick={handleBattleNow} className='battle-now'>Battle Now</button>
                </section>
            </div>
        </div>
    );
};

export default App;
