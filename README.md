## Quick Start 

- Clone  :  git clone https://github.com/er-vivekkhedkar/quick-quiz.git
- cd quick-quiz
- npm install
- npm start 
- http://localhost:3000  



# Quiz Challenge Application

An interactive quiz application built with React that features both API-driven and fallback default questions.

## 🚀 Features

- Dynamic question fetching from API
- Fallback default questions when API is unavailable
- Interactive welcome screen
- Real-time scoring system
- Responsive design for all devices
- Progress tracking
- Final score display
- If it fail to fetch the endpoint data from https://api.jsonserve.com/Uw5CrX then it will show the default questions.

## 🛠️ Technologies Used

- React.js
- CSS3
- JavaScript (ES6+)
- Axios (for API calls)

## 💡 How It Works

### Question Loading System

The application attempts to fetch questions from an API endpoint. If the fetch fails, it automatically falls back to default questions:


## 🎯 Components

### Welcome Component
- Entry point of the application
- Displays welcome message and start button
- Styled with responsive design

### Quiz Component
- Manages quiz state and logic
- Handles question loading (API or default)
- Tracks user progress and score

### Question Component
- Displays individual questions
- Handles user answer selection
- Shows feedback on answer submission

### Results Component
- Shows final score
- Offers option to retry quiz
- Displays performance summary

## 🔄 Default Questions System

When API fetching fails, the application uses a predefined set of questions:


### Default Questions Configuration
- Modify `defaultQuestions.js` to update the fallback questions
- Ensure each question follows the required format

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints:
  - Mobile: < 480px
  - Tablet: 480px - 768px
  - Desktop: > 768px


## 🐛 Bug Reporting

Report bugs by opening a new issue in the GitHub repository. Include:
- Detailed description of the bug
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)



## 🙏 Acknowledgments

- React.js community
- Contributors and testers
