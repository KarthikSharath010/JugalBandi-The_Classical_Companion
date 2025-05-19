import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Checking token...');
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    if (token) {
      fetch('/api/users/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          console.log('Fetch response for /me:', res.status, res.statusText);
          if (!res.ok) {
            throw new Error(`HTTP error: ${res.status} ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log('Fetch data for /me:', data);
          if (data.user) {
            setUser(data.user);
          } else {
            console.warn('No user data found, removing token');
            localStorage.removeItem('token');
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('Fetch error for /me:', err.message);
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      console.log('No token found');
      setLoading(false);
    }
  }, []);

  const login = async (email) => {
    try {
      console.log('Attempting login with email:', email);
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      console.log('Login response:', res.status, res.statusText);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error: ${res.status}`);
      }
      const data = await res.json();
      console.log('Login data:', data);
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
      } else {
        throw new Error('Invalid login response: missing token or user');
      }
      return data;
    } catch (err) {
      console.error('Login error:', err.message);
      throw err;
    }
  };

  const logout = () => {
    console.log('Logging out');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};