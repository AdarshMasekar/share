# File Sharing Application

A simple file sharing application built with React, Node.js, and MongoDB.

## Features

- Upload ZIP files (up to 50MB)
- List uploaded files
- Download files
- Delete files

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Tailwind CSS
  - Vite

- Backend:
  - Node.js
  - Express
  - MongoDB (GridFS for file storage)
  - Multer

## Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <repo-name>
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Configure MongoDB:
   - Create a MongoDB Atlas account or use local MongoDB
   - Update the MongoDB URI in `backend/server.js`

4. Start the application:
```bash
# Start backend (from backend directory)
npm start

# Start frontend (from frontend directory)
npm run dev
```

5. Access the application:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5001

## Environment Variables

Create a `.env` file in the backend directory with the following variables:
```
PORT=5001
MONGODB_URI=your_mongodb_connection_string
```

## License

MIT
