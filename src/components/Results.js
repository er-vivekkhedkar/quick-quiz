import React from 'react';
import '../styles/Results.css';

const Results = ({ results, onRetry, onBackToHome }) => {
  const { score, totalQuestions } = results;
  const percentage = ((score / (totalQuestions * 10)) * 100).toFixed(1);

  const getFeedback = () => {
    if (percentage >= 80) return "🏆 Outstanding Performance!";
    if (percentage >= 60) return "👏 Well Done!";
    if (percentage >= 40) return "💪 Good Effort!";
    return "📚 Keep Learning!";
  };

  return (
    <div className="results-container">
      <div className="score-card">
        <h1>Quiz Complete!</h1>
        <h2>{getFeedback()}</h2>
        
        <div className="final-score">
          {score} points
        </div>

        <div className="score-details">
          <p>Questions Answered: {totalQuestions}</p>
          <p>Correct Answers: {score/10}</p>
          <p>Accuracy: {percentage}%</p>
        </div>

        <div className="action-buttons">
          <button className="retry-button" onClick={onRetry}>
            Try Again
          </button>
          <button className="home-button" onClick={onBackToHome}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results; 