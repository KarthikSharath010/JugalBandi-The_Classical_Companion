import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PracticeTracker from './PracticeTracker';
import Reminders from './Reminders';
import './Lessons.css';

const Lessons = () => {
  const { user } = useContext(AuthContext);
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLessons();
    }
  }, [user]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/lessons?role=${user.role}&level=${user.level}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setLessons(data.lessons);
      } else {
        setError(data.message || 'Failed to fetch lessons');
      }
    } catch (err) {
      console.error('Fetch lessons error:', err);
      setError(`Error fetching lessons: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lessons-container">
      <div className="lessons-left">
        <h2>Lessons</h2>
        {loading && <p>Loading lessons...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && lessons.length === 0 ? (
          <p>No lessons available for your role and level.</p>
        ) : (
          <ul className="lessons-list">
            {lessons.map((lesson) => (
              <li key={lesson._id} className="lesson-item">
                <h3>{lesson.title}</h3>
                <p>{lesson.content}</p>
                <p className="lesson-details">
                  <strong>Role:</strong> {lesson.role} | <strong>Level:</strong> {lesson.level}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="lessons-right">
        <h2>Practice Tracker</h2>
        <PracticeTracker />
        <h2>Reminders</h2>
        <Reminders />
      </div>
    </div>
  );
};

export default Lessons;