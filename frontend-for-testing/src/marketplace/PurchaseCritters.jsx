import React from "react";
import Ignisfox from "./Ignisfox.jsx";
import Serplet from "./Serplet.jsx";
import Leafkin from "./Leafkin.jsx";
import Pyro from "./Pyro.jsx";
import Serpentaur from "./Serpentaur.jsx";
import Groveyard from "./Groveyard.jsx";
import "./index.css";
import Blazehound from "./Blazehound.jsx";
import Hydraconda from "./Hydraconda.jsx";
import Sylvan from "./Sylvan.jsx";
import Navbar from '../Navbar.jsx'
    
    const PurchaseCritters = () => {
      return (
        <div>
          <Navbar />
          <h1>Purchase Critters</h1>
          <div className="flexbox-container">
      <div className="top-row">
        <Ignisfox />
        <Serplet />
        <Leafkin />
      </div>
      <div className="middle-row">
        <Pyro />
        <Serpentaur />
        <Groveyard />
      </div>
      <div className="bottom-row">
        <Blazehound />
        <Hydraconda />
        <Sylvan />
      </div>
    </div>
        </div>
        
      )
    }
    
    export default PurchaseCritters;
