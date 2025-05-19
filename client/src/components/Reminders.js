import React, { useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Reminders.css';

const Reminders = () => {
  const { user } = React.useContext(AuthContext);
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchReminders();
    }
  }, [user]);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/reminders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setReminders(data.reminders);
      } else {
        setError(data.message || 'Failed to fetch reminders');
      }
    } catch (err) {
      console.error('Fetch reminders error:', err);
      setError(`Error fetching reminders: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, dueDate }),
      });
      const data = await res.json();
      if (res.ok) {
        setReminders([...reminders, data.reminder]);
        setTitle('');
        setDescription('');
        setDueDate('');
      } else {
        setError(data.message || 'Failed to add reminder');
      }
    } catch (err) {
      console.error('Add reminder error:', err);
      setError(`Error adding reminder: ${err.message}`);
    }
  };

  return (
    <div className="reminders-container">
      <form onSubmit={handleAddReminder} className="reminder-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Reminder title"
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
        />
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <button type="submit">Add Reminder</button>
      </form>
      {loading && <p>Loading reminders...</p>}
      {error && <p className="error">{error}</p>}
      {reminders.length === 0 && !loading ? (
        <p>No reminders set.</p>
      ) : (
        <ul className="reminder-list">
          {reminders.map((reminder) => (
            <li key={reminder._id} className="reminder-item">
              <h3>{reminder.title}</h3>
              <p>{reminder.description || 'No description'}</p>
              <p><strong>Due:</strong> {new Date(reminder.dueDate).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Reminders;