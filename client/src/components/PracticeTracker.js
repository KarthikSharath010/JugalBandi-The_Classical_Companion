import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './PracticeTracker.css';

const PracticeTracker = () => {
  const { user } = useContext(AuthContext);
  const [practices, setPractices] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    duration: '',
    description: '',
  });
  const [reminder, setReminder] = useState({ time: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchPractices();
    }
    // Request notification permission
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, [user]);

  const fetchPractices = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/practices', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.headers.get('content-type')?.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server returned non-JSON response: ${text.slice(0, 100)}...`);
      }
      const data = await res.json();
      if (res.ok) {
        setPractices(data.practices);
      } else {
        setError(data.message || 'Failed to fetch practices');
      }
    } catch (err) {
      console.error('Fetch practices error:', err);
      setError(err.message || 'Error fetching practices');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReminderChange = (e) => {
    setReminder({ time: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const url = editingId ? `/api/practices/${editingId}` : '/api/practices';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.headers.get('content-type')?.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server returned non-JSON response: ${text.slice(0, 100)}...`);
      }
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        fetchPractices();
        setFormData({ date: '', duration: '', description: '' });
        setEditingId(null);
      } else {
        setError(data.message || 'Failed to save practice');
      }
    } catch (err) {
      console.error('Save practice error:', err);
      setError(err.message || 'Error saving practice');
    }
  };

  const handleReminderSubmit = (e) => {
    e.preventDefault();
    if (!reminder.time) {
      setError('Please select a reminder time');
      return;
    }
    const [hours, minutes] = reminder.time.split(':');
    const now = new Date();
    const reminderTime = new Date(now);
    reminderTime.setHours(hours, minutes, 0, 0);

    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const timeDiff = reminderTime - now;
    setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification('Practice Reminder', {
          body: 'Time to practice your classical skills!',
        });
      }
    }, timeDiff);
    setMessage(`Reminder set for ${reminder.time}`);
    setReminder({ time: '' });
  };

  const handleEdit = (practice) => {
    setFormData({
      date: practice.date.split('T')[0],
      duration: practice.duration,
      description: practice.description || '',
    });
    setEditingId(practice._id);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/practices/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.headers.get('content-type')?.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server returned non-JSON response: ${text.slice(0, 100)}...`);
      }
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        fetchPractices();
      } else {
        setError(data.message || 'Failed to delete practice');
      }
    } catch (err) {
      console.error('Delete practice error:', err);
      setError(err.message || 'Error deleting practice');
    }
  };

  return (
    <div className="practice-tracker-container">
      <h3>Practice Tracker</h3>
      <form onSubmit={handleSubmit} className="practice-form">
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="duration"
          placeholder="Duration (minutes)"
          value={formData.duration}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <button type="submit">{editingId ? 'Update' : 'Log Practice'}</button>
      </form>
      <h4>Set Practice Reminder</h4>
      <form onSubmit={handleReminderSubmit} className="reminder-form">
        <input
          type="time"
          name="time"
          value={reminder.time}
          onChange={handleReminderChange}
          required
        />
        <button type="submit">Set Reminder</button>
      </form>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <h4>Practice History</h4>
      {practices.length === 0 ? (
        <p>No practices logged.</p>
      ) : (
        <ul className="practice-list">
          {practices.map((practice) => (
            <li key={practice._id} className="practice-item">
              {new Date(practice.date).toLocaleDateString()} - {practice.duration} min
              {practice.description && ` - ${practice.description}`}
              <div className="practice-actions">
                <button onClick={() => handleEdit(practice)}>Edit</button>
                <button onClick={() => handleDelete(practice._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PracticeTracker;