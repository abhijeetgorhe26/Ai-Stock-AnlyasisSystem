import React, { useEffect, useState } from 'react';

export default function App() {
  const [healthStatus, setHealthStatus] = useState('Checking backend status...');
  const [isOnline, setIsOnline] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetch(`${apiBaseUrl}/health`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setHealthStatus('Backend Connected');
          setIsOnline(true);
        } else {
          setHealthStatus('Backend status unexpected');
        }
      })
      .catch(() => {
        setHealthStatus('Backend Offline (Start express server at port 5000)');
      });
  }, [apiBaseUrl]);

  return (
    <div className="container">
      <span className="header-badge">Initial Development Setup</span>
      <h1>AI-Based Stock Market Prediction & Investment Assistant</h1>
      <p className="subtitle">
        System architecture foundation initialized. React frontend and Node.js Express backend are decoupled and ready for feature implementation.
      </p>

      <div className="status-grid">
        <div className="status-card">
          <h3>Frontend Environment</h3>
          <div className="status-indicator">
            <span className="dot"></span> React + Vite Running
          </div>
        </div>

        <div className="status-card">
          <h3>Backend Status</h3>
          <div className="status-indicator">
            <span className="dot" style={{ backgroundColor: isOnline ? '#34d399' : '#f87171', boxShadow: isOnline ? '0 0 8px #34d399' : '0 0 8px #f87171' }}></span>
            {healthStatus}
          </div>
        </div>
      </div>

      <footer>
        Decoupled Architecture | MVC Express Backend & React Frontend
      </footer>
    </div>
  );
}
