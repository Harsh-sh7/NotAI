<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Gemini Chat AI

A full-stack application featuring a chat interface for interacting with Google's Gemini AI model and a coding assistant with code execution capabilities.

## Project Structure

```
.
├── frontend/               # Frontend React application
│   ├── public/            # Static files
│   ├── src/               # Source files
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript type definitions
│   │   ├── App.tsx        # Main application component
│   │   └── main.tsx       # Application entry point
│   ├── .env.local         # Frontend environment variables
│   ├── index.html         # HTML template
│   ├── package.json       # Frontend dependencies
│   ├── tsconfig.json      # TypeScript configuration
│   └── vite.config.ts     # Vite configuration
│
├── backend/               # Backend Node.js/Express server
│   ├── server.js         # Express server
│   ├── .env              # Backend environment variables
│   └── package.json      # Backend dependencies
│
├── .gitignore            # Git ignore file
└── README.md             # This file
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm (v8 or later)
- Google Gemini API key
- RapidAPI key (for code execution)

### Installation

1. Clone this repository

2. Set up the backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your RapidAPI key
   ```

3. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   cp .env.local.example .env.local
   # Edit .env.local with your Gemini API key
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```
   The backend will be available at `http://localhost:5000`

2. In a new terminal, start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`

## Features

- **Chat Interface**: Interact with Google's Gemini AI model
- **Code Execution**: Run code in multiple languages (JavaScript, Python, Java, C++)
- **AI Code Assistant**: Get help with your code, explain errors, and ask questions
- **Syntax Highlighting**: Beautiful code highlighting with Monaco Editor
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean and intuitive user interface

## Code Execution Limitations

The application uses Judge0 API for code execution. Please note:

### Python
- ✅ **Supported**: Python 3.11 with standard library (os, sys, math, json, random, etc.)
- ❌ **Not Available**: External packages like numpy, pandas, requests, matplotlib, etc.
- 💡 **Tip**: Use only Python standard library modules

### JavaScript
- ✅ **Supported**: Node.js 18 with standard modules
- ❌ **Not Available**: npm packages, browser APIs (DOM, fetch, etc.)
- 💡 **Tip**: Use console.log() for output

### C++ & Java
- ✅ **Fully Supported**: Standard libraries available
- C++: GCC 9.2.0
- Java: OpenJDK 13 (class name must be `Main`)

## Built With

### Frontend
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Google Gemini API](https://ai.google.dev/)

### Backend
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Judge0 API](https://judge0.com/) (via RapidAPI)

## Environment Variables

### Frontend (`.env.local`)
```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_API_URL=http://localhost:5000
```

### Backend (`.env`)
```
PORT=5000
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=judge0-ce.p.rapidapi.com
```

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Backend
- `npm start` - Start the server
- `npm run dev` - Start in development mode with nodemon

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
