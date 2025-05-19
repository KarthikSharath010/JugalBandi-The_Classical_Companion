import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      background: '#f8f8f8',
      borderBottom: '1px solid #ddd'
    }}>
      <h1 style={{ margin: 0 }}>JugalBandi</h1>
      {user && (
        <nav style={{ display: 'flex', gap: '10px' }}>
          <Link to="/profile" style={{
            padding: '8px 16px',
            background: '#1890ff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}>
            Profile
          </Link>
          <button
            onClick={logout}
            style={{
              padding: '8px 16px',
              background: '#ff4d4f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </nav>
      )}
    </header>
  );
};

export default Header;