import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Navbar from '../Components/Navbar/Navbar';
import watermark from '../Components/Assets/watermark.png';
import grass from '../Components/Assets/grass-3.jpg';
import fire from '../Components/Assets/fox-3.jpg';
import water from '../Components/Assets/drag-3.jpg';

const Home = () => {
    const navigate = useNavigate();

    const handleBattleNow = () => {
       navigate('/battle');
    };
    const handleContactUs=() => {
        navigate('/contact-us')
    };
    

    return (
        <div>
            <Navbar />
            <div className="home-container">
                <section className="hero">
                    <h1>Discover digital art and Collect NFTs.</h1>
                    <div className="nft-collection">
                        <div className="nft-card">
                            <img src={grass} alt="Grass NFT" />
                            <h2>Grass NFT Name</h2>
                            <p>By <span>Metaclubbers</span></p>
                            <button>Buy Now</button>
                        </div>
                        <div className="nft-card">
                            <img src={fire} alt="Fox NFT" />
                            <h2>IGNIS FOX</h2>
                            <p>By <span>Metaclubbers</span></p>
                            <button>Bid Now</button>
                        </div>
                        <div className="nft-card">
                            <img src={water} alt="Dragon NFT" />
                            <h2>Dragon NFT Name</h2>
                            <p>By <span>Lonely_Llama</span></p>
                            <button>Buy Now</button>
                        </div>
                    </div>
                </section>

                <section className="cryptocurrencies">
                    <h2>Top Cryptocurrencies</h2>
                    <div className="crypto-list">
                        <div className="crypto-card">
                            <h3>Bitcoin</h3>
                            <p>USD 0.86546</p>
                        </div>
                        <div className="crypto-card">
                            <h3>Ethereum</h3>
                            <p>USD 1.80500</p>
                        </div>
                        <div className="crypto-card">
                            <h3>Binance</h3>
                            <p>USD 1.865</p>
                        </div>
                    </div>
                </section>

                <section className="game-description">
                    <h2>Game Description</h2>
                    <div className="description-content">
                        <p>Discover an epic battle game where you can use your NFTs to fight against other players. Collect, trade, and battle your way to the top!</p>
                        <img src={watermark} alt="Game Image" />
                        <button className="battle-now" onClick={handleBattleNow}>Battle Now</button>
                    </div>
                </section>

                <section className="socials">
                    <h2>Connect with Us</h2>
                    <button className="contact-us" onClick={handleContactUs}>ContactUs</button>
                    <div className="social-links">
                        <div className="social-card-1">
                            <h3>Yash Singh</h3>
                            <p>
                                <a href="https://github.com/yourgithub" target="_blank" rel="noopener noreferrer">GitHub</a><br />
                                <a href="https://www.instagram.com/yourinstagram" target="_blank" rel="noopener noreferrer">Instagram</a><br />
                                <a href="https://wa.me/yourwhatsapp" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                            </p>
                        </div>
                        </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
