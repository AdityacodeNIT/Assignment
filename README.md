# Full Stack Web Application Assignment

Hello Sir this repository contains the solution for the Full Stack Web Development Assessment. It features a React frontend and a Node.js/Express backend, with JWT authentication and a dashboard interface.

## Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, React Router DOM, Axios
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT), bcryptjs

## Prerequisites
- Node.js must be  installed
- A running MongoDB deployment (either local or MongoDB Atlas)


## Setup & Running the Application

### 1. Backend Setup
1. Open terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Open `backend/.env` file and replace the placeholder `MONGO_URI` with your MongoDB Atlas or local connection string:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/assignment
   JWT_SECRET=super_secret_jwt_key_for_assignment
   PORT=5000 -- or as you like 
   ```
4. **Seed the database** (Creates the test user `test@example.com` / `password123`):
   ```bash
   node seeder.js
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. The application should now be running. You can open your browser and navigate to the URL provided by Vite (typically `http://localhost:5173`).

## Usage
Log in using the seeded test credentials:
- **Email**: test@example.com
- **Password**: password123

This will authenticate you and securely redirect you to the protected Dashboard route, where a list of dummy Leads, Tasks, and Team members will be fetched dynamically via the authenticated API route.
