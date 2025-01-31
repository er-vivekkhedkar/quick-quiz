import React, { useState } from 'react';
import Quiz from './components/Quiz';
import Welcome from './components/Welcome';
import Results from './components/Results';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [quizResults, setQuizResults] = useState(null);

  const handleStartQuiz = () => {
    setCurrentScreen('quiz');
  };

  const handleQuizComplete = (results) => {
    setQuizResults(results);
    setCurrentScreen('results');
  };

  const handleRetry = () => {
    setCurrentScreen('quiz');
  };

  const handleBackToHome = () => {
    setCurrentScreen('welcome');
  };

  return (
    <div className="app">
      {currentScreen === 'welcome' && (
        <Welcome onStart={handleStartQuiz} />
      )}
      {currentScreen === 'quiz' && (
        <Quiz onComplete={handleQuizComplete} />
      )}
      {currentScreen === 'results' && (
        <Results 
          results={quizResults} 
          onRetry={handleRetry}
          onBackToHome={handleBackToHome}
        />
      )}
    </div>
  );
}

export default App;
