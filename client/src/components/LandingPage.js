import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <h1>Welcome to JugalBandi</h1>
      <p>Choose an option to continue:</p>
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