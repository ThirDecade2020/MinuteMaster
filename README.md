# MinuteMaster - Master Timing & Approach for Coding Challenges

## Overview
MinuteMaster is a web application designed to help developers stay focused and organized during coding challenges. The app provides a structured, timed workflow with specific tasks, allowing users to practice time management and maintain a step-by-step approach to solving coding problems.

Key functionalities include selecting difficulty levels, a countdown timer, and task-specific durations to guide users through a standardized coding workflow.

## Problem Solved
In coding interviews and competitive programming, effective time management and a structured approach are essential. MinuteMaster tackles these needs by:
- **Guiding developers through seven predefined tasks**, each focusing on essential coding stages (e.g., reading instructions, pseudocode, coding, testing).
- **Offering an adjustable difficulty setting** (easy, medium, hard), which adapts the task durations accordingly.
- **Providing start, pause, and reset controls** to give users flexibility and control over their practice sessions.

## Tech Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **AI**: OpenAI API

## Project Structure

```plaintext
MinuteMaster/
├── client/                     # Frontend files for the web interface
│   ├── index.html              # Main HTML file, defines structure and elements
│   ├── style.css               # CSS file, styles the app for readability and focus
│   └── script.js               # JavaScript file, contains app logic, timer, and task controls
│
├── server/                     # Backend API server
│   ├── app.js                  # Express server with OpenAI integration
│   ├── config/                 # Configuration files for environment settings (future)
│   ├── controllers/            # Route handling and main controller logic (future)
│   ├── models/                 # Database schemas for task management (future)
│   ├── routes/                 # Route definitions for backend API (future)
│   ├── services/               # Business logic separated from controllers (future)
│   ├── database/               # Database connection setup (future)
│   ├── middleware/             # Middleware functions (e.g., authentication, validation)
│   └── utils/                  # Utility functions (e.g., logging) for backend use
│
├── tests/                      # Testing files for frontend and backend functionality
│   ├── frontend/               # Frontend tests (e.g., UI tests with Cypress)
│   ├── backend/                # Backend tests (API and unit tests)
│   └── setup/                  # Testing setup files for configuring test environment
│
├── .env                        # Environment variables file (excluded from GitHub)
├── .gitignore                  # Specifies files to ignore in GitHub repository
├── LICENSE                     # License information for the project
└── README.md                   # Project overview, instructions, and structure (you’re reading this)
```

## Application Functionality

### Main Components
- **Timer**: 
  - Starts at 15 minutes for easy mode (adjustable with difficulty).
  - Counts down, showing the remaining time in `MM:SS` format.
  - Dynamically updates per task, helping users stay on track.

- **Difficulty Levels**: 
  - Users can select from easy, medium, and hard levels.
  - Task durations adjust according to difficulty, with harder levels allocating more time for each task.

- **Task List**:
  - Sequential tasks include essential coding steps like reading instructions, pseudocode, coding, testing, and debugging.
  - Each task is displayed with its remaining time.

- **User Controls**:
  - Start, pause, and reset buttons give users control over the timer and session.

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ThirDecade2020/MinuteMaster.git
   cd MinuteMaster
   ```

2. **Set up environment variables**:
   - Create `.env` file in root directory:
     ```
     OPENAI_API_KEY=your_api_key_here
     railway_url=https://minutemaster-production.up.railway.app
     ```

3. **Install dependencies**:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

4. **Run the application**:
   - Terminal 1 (Backend): `cd server && npm start` (runs on port 3000)
   - Terminal 2 (Frontend): `cd client && npm start` (runs on port 8080)
   - Open `http://localhost:8080` in your browser

## Future Enhancements

- **Backend Integration**: Potential setup for tracking session statistics or saving progress.
- **Database Support**: Placeholder backend structure to store user sessions or custom task lists.
- **Enhanced Testing**: Expanding UI and backend testing to cover more scenarios.

## License
This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

