import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import Navbar from '../src/Navbar.jsx';
import grass from '../src/Components/Assets/grass-3.jpg';
import fire from '../src/Components/Assets/blazehound.jpg';
import water from '../src/Components/Assets/Hydraconda.jpg';
import watermark from '../src/Assets/watermark.jpg';

const App = () => {
    const navigate = useNavigate();

    const handleBattleNow = () => {
       navigate('/battle');
    };

    return (
        <div className="home-page">
            <Navbar />
            <div className="home-container">
                <section className="hero">
                    <h1 className="hero-title">Discover Digital Art and Collect NFTs</h1>
                    <p className="hero-subtitle">Explore our exclusive NFT collection and join the battle today!</p>
                    <div className="nft-collection">
                        <div className="nft-card">
                            <img src={grass} alt="Grass NFT" className="nft-image"/>
                            <div className="nft-info">
                                <h2>Sylivian Collosus</h2>
                                <p>Rare and mystical, this NFT represents the mythical grass titan of ancient lore.</p>
                                <button className="nft-button">Buy Now</button>
                            </div>
                        </div>
                        <div className="nft-card">
                            <img src={fire} alt="Fox NFT" className="nft-image"/>
                            <div className="nft-info">
                                <h2>Ignis Fox</h2>
                                <p>Embodying the fiery spirit of the fox, this NFT is perfect for those who crave adventure.</p>
                                <button className="nft-button">Buy Now</button>
                            </div>
                        </div>
                        <div className="nft-card">
                            <img src={water} alt="Dragon NFT" className="nft-image"/>
                            <div className="nft-info">
                                <h2>HydroConda</h2>
                                <p>The ultimate water dragon NFT that channels the power of the ocean's depths.</p>
                                <button className="nft-button">Buy Now</button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="game-description">
                    <h2 className="description-title">Game Description</h2>
                    <div className="description-content">
                        <p>Immerse yourself in an epic battle game where your NFTs become your ultimate weapons. Collect, trade, and battle your way to glory!</p>
                        <img src={watermark} alt="Game Preview" className="game-image"/>
                        <button className="battle-now" onClick={handleBattleNow}>Battle Now</button>
                    </div>
                </section>

                <section className="features">
                    <h2 className="features-title">Features</h2>
                    <div className="features-content">
                        <div className="feature-item">
                            <h3>Unique NFT Collections</h3>
                            <p>Our NFTs are one-of-a-kind digital assets that you can collect, trade, and use in the game.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Epic Battles</h3>
                            <p>Engage in thrilling battles with your NFTs and climb the leaderboard to prove your dominance.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Trade and Collect</h3>
                            <p>Trade with other players and expand your NFT collection to create the ultimate team.</p>
                        </div>
                    </div>
                </section>

                <section className="testimonials">
                    <h2 className="testimonials-title">What Players Are Saying</h2>
                    <div className="testimonial-item">
                        <p>"An exhilarating game with stunning NFTs! The battles are intense and the community is amazing."</p>
                        <h4>- Alex P.</h4>
                    </div>
                    <div className="testimonial-item">
                        <p>"I love collecting these unique NFTs and the game itself is very engaging. Highly recommend!"</p>
                        <h4>- Jamie L.</h4>
                    </div>
                    <div className="testimonial-item">
                        <p>"The NFT marketplace is top-notch. Easy to use and the battles are a lot of fun."</p>
                        <h4>- Taylor R.</h4>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default App;
