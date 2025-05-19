import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './ProfileForm.css';

const ProfileForm = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    role: user.role || '',
    level: user.level || '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    setMessage('Profile updated successfully');
    setFormData({ ...formData, password: '' });
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server returned non-JSON response: ${text.slice(0, 100)}...`);
      }
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Deletion failed');
      }
      setMessage('Account deleted successfully');
      await logout();
      setTimeout(() => navigate('/', { replace: true }), 1000);
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message);
    }
  };

  return (
    <div className="profile-form-container">
      <h3>Update Profile</h3>
      <form onSubmit={handleSubmit} className="profile-form">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="New Password (optional)"
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="">Select Role</option>
          <option value="Dancer">Dancer</option>
          <option value="Instrumentalist">Instrumentalist</option>
          <option value="Both">Both</option>
        </select>
        <select
          name="level"
          value={formData.level}
          onChange={handleChange}
          required
        >
          <option value="">Select Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Junior">Junior</option>
          <option value="Senior">Senior</option>
        </select>
        <button type="submit">Update Profile</button>
      </form>
      <button className="delete-button" onClick={handleDelete}>Delete Account</button>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ProfileForm;