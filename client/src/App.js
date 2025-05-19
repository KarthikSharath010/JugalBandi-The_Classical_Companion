import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import Lessons from './components/Lessons';
import ProfilePage from './components/ProfilePage';
import Header from './components/Header';
import { AuthContext } from './context/AuthContext';
import './App.css';

const App = () => {
  const { user } = React.useContext(AuthContext);

  return (
    <div className="app-container">
      {user && <Header />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/lessons" element={user ? <Lessons /> : <LoginForm />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <LoginForm />} />
      </Routes>
    </div>
  );
};

export default App;