// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import ProfilePage from './components/ProfilePage';
import RegisterForm from './components/RegisterForm'; // Add this import

function App() {
  return (
    <BrowserRouter>
      <div>
        <h1>JugalBandi – The Classical Companion</h1>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} /> {/* Add this route */}
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;