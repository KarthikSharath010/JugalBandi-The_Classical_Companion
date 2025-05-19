import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ProfileForm from './ProfileForm';

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user) {
      setProfile(user);
    }
  }, [user]);

  const handleUpdate = async (updatedUser) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data.user);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log('Error updating profile:', err);
    }
  };

  return (
    <div>
      <h2>Profile Page</h2>
      {profile ? (
        <>
          <ProfileForm user={profile} onUpdate={handleUpdate} />
          <Link
            to="/lessons"
            style={{
              display: 'inline-block',
              margin: '10px 0',
              padding: '8px 16px',
              background: '#1890ff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
            }}
          >
            View Lessons
          </Link>
          <br />
          <button
            onClick={logout}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              background: '#ff4d4f',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default ProfilePage;