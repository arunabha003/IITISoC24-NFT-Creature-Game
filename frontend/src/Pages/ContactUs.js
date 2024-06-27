import React from 'react'
import './ContactUs.css';
import Navbar from '../Components/Navbar/Navbar'
import aep from '../Components/Assets/aep.jpg'
import yash from '../Components/Assets/yash.png'
import shorya from '../Components/Assets/shorya.png'
import kanav from '../Components/Assets/kanav.png'
import insta from '../Components/Assets/insta.avif'
import whatsapp from '../Components/Assets/whatsapp.jpg'
import github from '../Components/Assets/github.png'

function ContactUs() {
  return (
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
            <a href="https://wa.me/yourwhatsappnumber" target="_blank" rel="noopener noreferrer">
              <img src={whatsapp} alt="WhatsApp" />
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
            <a href="https://wa.me/yourwhatsappnumber" target="_blank" rel="noopener noreferrer">
              <img src={whatsapp} alt="WhatsApp" />
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
            <a href="https://wa.me/yourwhatsappnumber" target="_blank" rel="noopener noreferrer">
              <img src={whatsapp} alt="WhatsApp" />
            </a>
            <a href="https://github.com/yourprofile" target="_blank" rel="noopener noreferrer">
              <img src={github} alt="GitHub" />
            </a>
          </div>
        </div>
        <div className="social-card">
          <img src={shorya} alt="Shorya Shetty" />
          <h3>Shorya Shetty</h3>
          <div className="social-icons">
            <a href="https://www.instagram.com/shorya._.k/" target="_blank" rel="noopener noreferrer">
              <img src={insta} alt="Instagram" />
            </a>
            <a href="https://wa.me/yourwhatsappnumber" target="_blank" rel="noopener noreferrer">
              <img src={whatsapp} alt="WhatsApp" />
            </a>
            <a href="https://github.com/yourprofile" target="_blank" rel="noopener noreferrer">
              <img src={github} alt="GitHub" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
