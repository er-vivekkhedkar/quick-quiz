import React, { useState, useEffect, useRef, useCallback } from 'react';
import quizService from '../services/quizService';
import '../styles/Quiz.css';

const Quiz = () => {
  const timerRef = useRef(null);
  
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(30);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [skippedQuestions, setSkippedQuestions] = useState(new Set());
  const [showHint, setShowHint] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [currentHint, setCurrentHint] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const handleTimeUp = useCallback(() => {
    if (quiz?.questions?.[currentQuestion]) {
      setSkippedQuestions(prev => new Set([...prev, quiz.questions[currentQuestion].id]));
      clearInterval(timerRef.current);
      handleNextQuestion();
    }
  }, [currentQuestion, quiz]);

  useEffect(() => {
    const startTime = Date.now();
    const loadQuiz = async () => {
      try {
        const quizData = await quizService.fetchQuizData();
        setQuiz(quizData);
        setLoading(false);
        setQuestionStartTime(Date.now());
      } catch (error) {
        console.error('Error loading quiz:', error);
        setLoading(false);
      }
    };
    loadQuiz();

    return () => {
      const endTime = Date.now();
      setTimeSpent((endTime - startTime) / 1000);
    };
  }, []);

  useEffect(() => {
    if (timer > 0 && !quizCompleted && !showFeedback && quiz) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timerRef.current);
    } else if (timer === 0 && !quizCompleted) {
      handleTimeUp();
    }
  }, [timer, quizCompleted, showFeedback, handleTimeUp, quiz]);

  const handleQuizComplete = () => {
    if (quizCompleted) return;
    
    clearInterval(timerRef.current);
    const finalResults = quizService.calculateScore(answers, quiz.questions, skippedQuestions);
    setResults(finalResults);
    setQuizCompleted(true);
    setShowConfirmModal(false);
  };

  const handleSubmitClick = () => {
    if (timer > 10) {
      setShowConfirmModal(true);
    } else {
      handleQuizComplete();
    }
  };

  const handleNextQuestion = () => {
    if (!quiz) return;
    
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTimer(30);
      setShowFeedback(false);
      setQuestionStartTime(Date.now());
    } else {
      handleQuizComplete();
    }
  };

  const handleSkip = () => {
    if (window.confirm('Are you sure you want to skip this question?')) {
      setSkippedQuestions(prev => new Set([...prev, quiz.questions[currentQuestion].id]));
      handleNextQuestion();
    }
  };

  const handleHint = () => {
    if (!quiz || !quiz.questions[currentQuestion]) return;
    
    if (hintCount < 3) {
      try {
        const hintData = {
          generalHint: quiz.questions[currentQuestion].hint,
          conceptual: quiz.questions[currentQuestion].conceptualHint,
          remainingHints: 3 - hintCount - 1
        };
        
        setCurrentHint(hintData);
        setShowHint(!showHint);
        if (!showHint) {
          setHintCount(prev => prev + 1);
        }
      } catch (error) {
        console.error('Error showing hint:', error);
      }
    } else {
      alert('You have used all your hints for this quiz!');
    }
  };

  const handleAnswer = (questionId, optionId) => {
    const currentQ = quiz.questions[currentQuestion];
    const isCorrect = currentQ.options.find(opt => opt.id === optionId)?.isCorrect;
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        selectedId: optionId,
        isCorrect,
        timeSpent: 30 - timer
      }
    }));
    
    setShowFeedback(true);
    clearInterval(timerRef.current);

    setTimeout(() => {
      setShowFeedback(false);
      handleNextQuestion();
    }, 2000);
  };

  if (loading) {
    return (
      <div className="quiz-loading">
        <div className="loader"></div>
        <p>Preparing your quiz...</p>
        <p className="loading-tip">Get ready for some exciting science questions!</p>
      </div>
    );
  }

  if (quizCompleted && results) {
    return (
      <div className="quiz-results">
        <div className="results-container">
          <div className="results-header">
            <div className="results-badge">
              {results.passed ? '🏆' : '📚'}
            </div>
            <h2>{results.passed ? 'Congratulations!' : 'Keep Learning!'}</h2>
            <p className="results-subtitle">
              {results.passed 
                ? "Great job! You've demonstrated excellent knowledge!" 
                : "Don't worry! Every attempt helps you learn better."}
            </p>
          </div>

          <div className="score-overview">
            <div className="score-circle">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#eee"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={results.percentage >= 60 ? "#4CAF50" : "#FFA726"}
                  strokeWidth="3"
                  strokeDasharray={`${results.percentage}, 100`}
                />
                <text x="18" y="18.5" className="percentage-text">
                  {results.percentage}%
                </text>
                <text x="18" y="25" className="percentage-label">
                  Score
                </text>
              </svg>
            </div>

            <div className="stats-grid">
              <div className="stat-card correct">
                <div className="stat-icon">✓</div>
                <div className="stat-details">
                  <span className="stat-value">{results.correctAnswers}</span>
                  <span className="stat-label">Correct</span>
                </div>
              </div>
              <div className="stat-card incorrect">
                <div className="stat-icon">✗</div>
                <div className="stat-details">
                  <span className="stat-value">{results.incorrectAnswers}</span>
                  <span className="stat-label">Incorrect</span>
                </div>
              </div>
              <div className="stat-card skipped">
                <div className="stat-icon">⟳</div>
                <div className="stat-details">
                  <span className="stat-value">{results.skipped}</span>
                  <span className="stat-label">Skipped</span>
                </div>
              </div>
              <div className="stat-card time">
                <div className="stat-icon">⏱</div>
                <div className="stat-details">
                  <span className="stat-value">{Math.round(results.averageTime)}s</span>
                  <span className="stat-label">Avg. Time</span>
                </div>
              </div>
            </div>
          </div>

          <div className="performance-analysis">
            <h3>Performance Analysis</h3>
            <div className="time-chart">
              {results.timeAnalysis.map((analysis, index) => (
                <div key={index} className="time-bar">
                  <div className="bar-label">Q{analysis.questionNumber}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ 
                        width: `${(analysis.timeSpent / 30) * 100}%`,
                        backgroundColor: analysis.timeSpent > 20 ? '#FFA726' : '#4CAF50'
                      }}
                    ></div>
                    <span className="bar-value">{analysis.timeSpent}s</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="question-review">
            <h3>Detailed Review</h3>
            {results.questionResults.map((result, index) => (
              <div key={index} className={`review-card ${result.status}`}>
                <div className="review-header">
                  <span className="question-number">Question {index + 1}</span>
                  <span className={`status-badge ${result.status}`}>
                    {result.status === 'correct' ? '✓ Correct' : 
                     result.status === 'incorrect' ? '✗ Incorrect' : 
                     result.status === 'skipped' ? '⟳ Skipped' : '⏱ Timeout'}
                  </span>
                </div>
                <p className="review-question">{result.question}</p>
                <div className="answer-details">
                  {result.userAnswer && (
                    <div className="user-answer">
                      <span>Your Answer:</span> {result.userAnswer}
                    </div>
                  )}
                  <div className="correct-answer">
                    <span>Correct Answer:</span> {result.correctAnswer}
                  </div>
                  {(result.status === 'incorrect' || result.status === 'skipped') && (
                    <div className="explanation">
                      <span>Explanation:</span> {result.explanation}
                    </div>
                  )}
                  <div className="time-taken">
                    <span>Time Taken:</span> {result.timeSpent} seconds
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="results-actions">
            <button 
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
            <button 
              className="share-button"
              onClick={() => {
                const text = `I scored ${results.percentage}% on the Science Quiz! 🎯`;
                if (navigator.share) {
                  navigator.share({
                    title: 'Quiz Result',
                    text: text,
                    url: window.location.href
                  });
                } else {
                  navigator.clipboard.writeText(text);
                  alert('Result copied to clipboard!');
                }
              }}
            >
              Share Result
            </button>
            <button 
              className="download-button"
              onClick={() => {
                // Add PDF download functionality here
                alert('Certificate download coming soon!');
              }}
            >
              Download Certificate
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz?.questions?.[currentQuestion] || null;

  if (!currentQ) {
    return (
      <div className="quiz-error">
        <p>Error loading quiz. Please try again.</p>
        <button onClick={() => window.location.reload()}>Reload</button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
          <div className="progress-info">
            <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
            <span className={`timer ${timer <= 10 ? 'warning' : ''}`}>
              {timer}s
            </span>
          </div>
        </div>
      </div>

      <div className="question-card">
        <h3 className="question-text">{currentQ.question}</h3>
        
        <div className="options-grid">
          {[0, 1].map(row => (
            <div key={row} className="options-row">
              {currentQ.options.slice(row * 2, (row + 1) * 2).map((option, index) => {
                const isSelected = answers[currentQ.id]?.selectedId === option.id;
                const isCorrectOption = option.isCorrect;
                
                let optionClass = 'option-button';
                if (showFeedback) {
                  if (isCorrectOption) {
                    optionClass += ' correct';
                  } else if (isSelected && !isCorrectOption) {
                    optionClass += ' incorrect';
                  }
                } else if (isSelected) {
                  optionClass += ' selected';
                }
                
                return (
                  <button
                    key={option.id}
                    className={optionClass}
                    onClick={() => handleAnswer(currentQ.id, option.id)}
                    disabled={!!answers[currentQ.id] || showFeedback}
                  >
                    <span className="option-number">{row * 2 + index + 1}</span>
                    <span className="option-text">{option.text}</span>
                    {showFeedback && (
                      <span className="feedback-icon">
                        {isCorrectOption ? '✓' : (isSelected ? '✗' : '')}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="quiz-actions">
          <button 
            className="hint-button"
            onClick={handleHint}
            disabled={showFeedback || hintCount >= 3}
          >
            💡 Hint ({3 - hintCount} remaining)
          </button>
          <button 
            className="skip-button"
            onClick={handleSkip}
            disabled={showFeedback}
          >
            ⟳ Skip
          </button>
        </div>

        {showHint && currentHint && (
          <div className="hint-box">
            <div className="hint-content">
              <h4>Study Hint</h4>
              <p>{currentHint.generalHint}</p>
              
              {currentHint.conceptual && (
                <div className="concept-hint">
                  <h5>Key Concept: {currentHint.conceptual.topic}</h5>
                  <ul className="key-points">
                    {currentHint.conceptual.keyPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                  <div className="related-topics">
                    <h6>Related Topics:</h6>
                    <div className="topic-tags">
                      {currentHint.conceptual.relatedTopics.map((topic, index) => (
                        <span key={index} className="topic-tag">{topic}</span>
                      ))}
                    </div>
                  </div>
                  {currentHint.conceptual.neetContext && (
                    <div className="neet-context">
                      <h6>NEET Context:</h6>
                      <p>{currentHint.conceptual.neetContext}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="hint-footer">
              <span className="hints-remaining">
                Hints remaining: <span className="hints-remaining-count">
                  {currentHint.remainingHints}
                </span>
              </span>
              <button 
                className="close-hint"
                onClick={() => setShowHint(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {showFeedback && (
          <div className={`feedback-message ${answers[currentQ.id]?.isCorrect ? 'correct' : 'incorrect'}`}>
            {answers[currentQ.id]?.isCorrect ? (
              <p>✨ Excellent! That's correct!</p>
            ) : (
              <div>
                <p>❌ Not quite right</p>
                <p>Correct answer: {currentQ.options.find(opt => opt.isCorrect).text}</p>
                <p className="explanation">{currentQ.explanation}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showConfirmModal && (
        <div className="confirm-modal">
          <div className="modal-content">
            <h3>Submit Quiz?</h3>
            <p>Are you sure you want to submit your answers?</p>
            <div className="modal-buttons">
              <button 
                className="cancel-button"
                onClick={() => setShowConfirmModal(false)}
              >
                Continue Quiz
              </button>
              <button 
                className="submit-button"
                onClick={handleQuizComplete}
              >
                Submit Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz; 