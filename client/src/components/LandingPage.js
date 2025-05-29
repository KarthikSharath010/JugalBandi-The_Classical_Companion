import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.jpg'; // Import the logo from src/components
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <img src={logo} alt="JugalBandi Logo" className="landing-logo" />
      <h1>JugalBandi</h1>
      <p className="tagline">The Classical Companion</p>
      <div className="button-group">
        <Link to="/login" className="landing-button login-button">
          Login
        </Link>
        <Link to="/register" className="landing-button register-button">
          Register
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;