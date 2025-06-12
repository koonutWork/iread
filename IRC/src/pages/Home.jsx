import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../components/ChatWindow.css';

function Home({ currentUser }) {
  const [welcomeData, setWelcomeData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWelcomeMessage() {
      try {
        const response = await fetch('http://localhost:8000/');
        if (!response.ok) {
          throw new Error('Failed to fetch welcome message');
        }
        const data = await response.json();
        setWelcomeData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWelcomeMessage();
  }, []);

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">กำลังโหลด...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h1>{welcomeData?.message}</h1>
      <div className="welcome-message">
        {welcomeData?.ai_response}
      </div>
      {currentUser && (
        <div className="user-info">
          <strong>Logged in as: {currentUser.Email}</strong>
        </div>
      )}
      <div className="cta-buttons">
        <Link to="/interview" className="cta-button primary">
          เริ่มการสัมภาษณ์
        </Link>
        <Link to="/pricing" className="cta-button secondary">
          ดูราคา
        </Link>
      </div>
      <div className="version-info">
        Version: {welcomeData?.version}
      </div>
    </div>
  );
}

export default Home;
