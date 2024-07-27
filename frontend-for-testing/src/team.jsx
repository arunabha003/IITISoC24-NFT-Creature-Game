import React from 'react'
import './team.css';
import Navbar from '../src/Navbar.jsx'
import aep from '../src/Assets/aep.jpg'
import yash from '../src/Assets/yash.jpg'
import shorya from '../src/Assets/shorya.jpg'
import kanav from '../src/Assets/kanav.jpg'
import insta from '../src/Assets/instagram.jpg'
import github from '../src/Assets/github.jpg'

function ContactUs() {
  return (
    <div className="page-container">
      <div>
      <Navbar />
      <div className="heading">CONNECT WITH US</div>
      <div className="Socials">
        <div className="social-card">
          <img src={kanav} alt="Kanav Bansal" />
          <h3>Kanav Bansal</h3>
          <div className="social-icons">
            <a href="https://www.instagram.com/kanavbansal22/" target="_blank" rel="noopener noreferrer">
              <img src={insta} alt="Instagram" />
            </a>
            <a href="https://github.com/yourprofile" target="_blank" rel="noopener noreferrer">
              <img src={github} alt="GitHub" />
            </a>
          </div>
        </div>
        <div className="social-card">
          <img src={yash} alt="Yash Singh" />
          <h3>Yash Singh</h3>
          <div className="social-icons">
            <a href="https://www.instagram.com/singhyashhhhh/" target="_blank" rel="noopener noreferrer">
              <img src={insta} alt="Instagram" />
            </a>
            <a href="https://github.com/yourprofile" target="_blank" rel="noopener noreferrer">
              <img src={github} alt="GitHub" />
            </a>
          </div>
        </div>
        <div className="social-card">
          <img src={aep} alt="Anurag E Prasad" />
          <h3>Anurag E Prasad</h3>
          <div className="social-icons">
            <a href="https://www.instagram.com/anurag_prasad06/" target="_blank" rel="noopener noreferrer">
              <img src={insta} alt="Instagram" />
            </a>
            <a href="https://github.com/yourprofile" target="_blank" rel="noopener noreferrer">
              <img src={github} alt="GitHub" />
            </a>
          </div>
        </div>
        <div className="social-card">
          <img src={shorya} alt="Shorya K Shettry" />
          <h3>Shorya K Shettry</h3>
          <div className="social-icons">
            <a href="https://www.instagram.com/shorya._.k/" target="_blank" rel="noopener noreferrer">
              <img src={insta} alt="Instagram" />
            </a>
            <a href="https://github.com/yourprofile" target="_blank" rel="noopener noreferrer">
              <img src={github} alt="GitHub" />
            </a>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default ContactUs;