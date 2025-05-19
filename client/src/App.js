import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import LoginForm from './components/LoginForm';
import ProfilePage from './components/ProfilePage';
import RegisterForm from './components/RegisterForm';
import Lessons from './components/Lessons';
import Header from './components/Header';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <p>Loading...</p>;
  return user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div>
          <Header />
          <AuthContext.Consumer>
            {({ loading }) => (
              loading ? (
                <p>Loading...</p>
              ) : (
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/register" element={<RegisterForm />} />
                  <Route
                    path="/profile"
                    element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
                  />
                  <Route
                    path="/lessons"
                    element={<ProtectedRoute><Lessons /></ProtectedRoute>}
                  />
                </Routes>
              )
            )}
          </AuthContext.Consumer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;