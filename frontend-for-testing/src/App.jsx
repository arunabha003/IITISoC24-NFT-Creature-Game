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
                            <h2>Sylvan Colossus</h2>
                            <p>"Nature's Wrath - summoning the fury of the forest to unleash a devastating onslaught of vines, roots, and stone, overwhelming its enemies with natural might."</p>
                            <button>Buy Now</button>
                        </div>
                        <div className="nft-card">
                            <img src={fire} alt="Fox NFT" />
                            <h2>Blazehound</h2>
                            <p>A sleek, muscular fox with the attitude of a demon dog, acts like a ninja hound with immense speed and grace.</p>
                            <button>Buy Now</button>
                        </div>
                        <div className="nft-card">
                            <img src={water} alt="Dragon NFT" />
                            <h2>HydroConda</h2>
                            <p>An awe-inspiring water dragon, Hydra Conda possesses multiple heads and shimmering scales, ruling the ocean with unrivaled ferocity and intelligence.</p>
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
