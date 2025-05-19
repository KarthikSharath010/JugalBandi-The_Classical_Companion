import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './LoginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email);
      console.log('Login response data:', data);
      if (data.token && data.user) {
        setMessage('Login successful');
        setEmail('');
        setTimeout(() => navigate('/lessons', { replace: true }), 1000);
      } else {
        setMessage(data.message || 'Login failed: No token or user data');
      }
    } catch (err) {
      console.error('Login error:', err);
      setMessage(`Login failed: ${err.message}`);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p className={message.includes('success') ? 'success' : 'error'}>{message}</p>}
    </div>
  );
};

export default LoginForm;