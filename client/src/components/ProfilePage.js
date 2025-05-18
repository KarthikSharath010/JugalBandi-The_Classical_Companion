// src/components/ProfilePage.js
import React, { useState, useEffect } from 'react';
import ProfileForm from './ProfileForm';

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    fetch('/api/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`, // Include token in headers
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          console.log('Error fetching user data:', data.message);
        }
      })
      .catch((err) => console.log('Error fetching user data:', err));
  }, []);

  const handleUpdate = async (updatedUser) => {
    const token = localStorage.getItem('token'); // Retrieve token
    try {
      const res = await fetch('/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include token in headers
        },
        body: JSON.stringify(updatedUser),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user); // Update the local state with the new data
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
      {user ? (
        <ProfileForm user={user} onUpdate={handleUpdate} />
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default ProfilePage;