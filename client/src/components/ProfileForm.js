import React, { useState } from 'react';
import './ProfileForm.css';

const ProfileForm = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    role: user.role || '',
    level: user.level || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
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
    </div>
  );
};

export default ProfileForm;