import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProfileForm from './ProfileForm';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleUpdate = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server returned non-JSON response: ${text.slice(0, 100)}...`);
      }
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Update failed');
      }
    } catch (err) {
      console.error('Update error:', err);
      throw err;
    }
  };

  return (
    <div className="profile-page-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        Back
      </button>
      <h2>Profile Page</h2>
      {user && <ProfileForm user={user} onUpdate={handleUpdate} />}
    </div>
  );
};

export default ProfilePage;