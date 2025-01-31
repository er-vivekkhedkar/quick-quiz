import React from 'react';
import '../styles/Welcome.css';

const Welcome = ({ onStart }) => {
  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <h1>Quiz Challenge</h1>
        <div className="quiz-info">
          <div className="info-item">
            <span className="icon">🎯</span>
            <p>Test your knowledge</p>
          </div>
          <div className="info-item">
            <span className="icon">⚡</span>
            <p>Quick questions</p>
          </div>
          <div className="info-item">
            <span className="icon">🏆</span>
            <p>Earn points</p>
          </div>
        </div>
        <button className="start-button" onClick={onStart}>
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default Welcome; 