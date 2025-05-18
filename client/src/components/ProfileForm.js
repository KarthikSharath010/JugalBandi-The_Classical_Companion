// ProfileForm.js
import React, { useState, useEffect } from 'react';

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
    onUpdate(formData); // Send updated user data to parent (ProfilePage)
  };

  return (
    <form onSubmit={handleSubmit}>
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
        <option value="Beginner">Beginner</option>
        <option value="Junior">Junior</option>
        <option value="Senior">Senior</option>
      </select>
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default ProfileForm;
