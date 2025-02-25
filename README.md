# Simple ZIP File Sharing

⚠️ **SECURITY WARNING** ⚠️
This application provides NO AUTHENTICATION or SECURITY measures. Anyone with the URL can upload and download files. DO NOT use this for sensitive data.

## Overview
A simple web application for uploading and downloading ZIP files. Files are stored in MongoDB using GridFS.

## Features
- Upload ZIP files (max 50MB)
- View list of uploaded files
- Download files
- No authentication required

## Tech Stack
- Frontend: React.js
- Backend: Node.js/Express.js
- Database: MongoDB (GridFS)
- Deployment: Vercel

## Development
1. Clone the repository
2. Install dependencies:
   ```bash
   cd frontend && npm install
   cd backend && npm install
   ```
3. Set up environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```
4. Run development servers:
   ```bash
   # Frontend
   cd frontend && npm run dev
   # Backend
   cd backend && npm run dev
   ```

## Security Notice
This application is intentionally built WITHOUT any security measures. It is suitable only for temporary, non-sensitive file sharing.
