# About the Project

This is a Wordle-inspired game built as a full-stack application using **React**, **Express** and **MongoDB**.

The game gives real-time feedback on every guessed letter, includes a highscore list with filters and sorting, and offers an optional timed mode. All highscores are saved in a MongoDB Atlas database for better performance and scalability.

---

## Key Features

- Choose word length between 5 and 8 letters  
- Option to play with only unique letters  
- Option to play with timer to track how fast you solve the word  
- Server-side word generation and feedback to prevent cheating  
- Filterable and sortable highscore list with pagination
- Highscores stored in MongoDB Atlas
- Fully responsive layout for mobile and desktop  
- Live deployment using [Render](https://wordle-fullstack-app.onrender.com/)

---

## Technologies Used

- **Frontend:** React, Vite, React Router  
- **Backend:** Express, Node.js  
- **Database:** MongoDB Atlas
- **Templating:** EJS (for server-side rendered highscores)
- **Styling:** CSS  
- **Testing:** Jest

---

## Source Code

The full source code is available on [GitHub](https://github.com/JohnnyAstrom/wordle-fullstack).

---

## First time you open to project:

#### 1: Clone project
- git clone https://github.com/JohnnyAstrom/Wordle-Fullstack.git

#### 2: Install backend dependencies
- cd Wordle-Fullstack/backend
- npm install

#### 3: Create a `.env` file in `/backend` folder

- For testing and reviewing the app, enter the following lines into the `.env` file:
```env
# MongoDB URI for main gameplay
MONGODB_URI=mongodb+srv://demo:wordleTest2025@cluster0.mongodb.net/Wordle-Highscores?retryWrites=true&w=majority&appName=cluster0

# MongoDB URI for test environment
TEST_MONGODB_URI=mongodb+srv://demo:wordleTest2025@cluster0.mongodb.net/wordle-test?retryWrites=true&w=majority&appName=cluster0
```

#### 4: Build frontend (React)
- cd ../frontend
- npm install
- npm run build

#### 5: Start the server (Express)
- npm start

#### Optional: Run tests
- npm test (from backend/ folder)

---

