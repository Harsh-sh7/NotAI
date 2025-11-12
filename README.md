# 🧠 NotAI — AI Chat & Code Execution Assistant

A full-stack web app that merges **AI-powered chat** with **live code execution**, built using **React, TypeScript, Node.js**, and **MongoDB**.

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)
![Express](https://img.shields.io/badge/Backend-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)

---

## ⚡ Overview

NotAI lets users **chat with Google Gemini AI**, manage multiple conversations, and **execute code in real time** across popular programming languages — all in one clean, responsive interface.

---

## ✨ Features

### 💬 Chat Interface
- Google Gemini AI integration  
- Real-time streaming responses  
- Persistent chat history (MongoDB)  
- Multiple conversation sessions  

### 💻 Code Assistant
- Supports **JavaScript, Python, Java, C++**  
- **Judge0 API** integration for safe cloud execution  
- Monaco Editor (VS Code-like experience)  
- Syntax highlighting and error reporting  

### 🔐 Authentication
- JWT-based user sessions  
- Encrypted passwords (bcrypt)  
- Protected API routes  

### 📱 Responsive Design
- Mobile-first layout  
- PWA-ready for installable experience  
- Smooth animations and dark/light mode  

---

## 🧩 Project Structure

### Frontend — React + TypeScript
```
frontend/
├── src/
│   ├── components/   # Chat, CodeEditor, Auth, etc.
│   ├── context/      # Auth & Chat state
│   ├── services/     # API integration
│   └── types/        # TypeScript definitions
```

### Backend — Node.js + Express
```
backend/
├── models/       # MongoDB schemas (User, Chat)
├── routes/       # Auth & Chat APIs
├── middleware/   # JWT verification
└── server.js     # Entry point
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React, TypeScript, Tailwind CSS, Vite, Monaco Editor |
| **Backend** | Node.js, Express.js, Mongoose |
| **Database** | MongoDB |
| **External APIs** | Google Gemini AI, Judge0 API |
| **Auth** | JWT, bcrypt |

---

## 🧱 Database Models

**User**
```js
{
  username: String,
  email: String,
  password: String,
  createdAt: Date
}
```

**Chat**
```js
{
  user: ObjectId (ref: User),
  title: String,
  messages: [{ role: String, content: String, timestamp: Date }],
  createdAt: Date
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 16  
- MongoDB (local or Atlas)  
- Google Gemini API key  
- Judge0 API key  

### Setup
```bash
git clone https://github.com/Harsh-sh7/NotAI.git
cd NotAI
```

#### Backend
```bash
cd backend
npm install
# Add .env
MONGODB_URI=mongodb://localhost:27017/notai
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
RAPIDAPI_KEY=your_judge0_api_key
PORT=5001

npm run dev
```

#### Frontend
```bash
cd ../frontend
npm install
# Add .env
VITE_API_URL=http://localhost:5001
GEMINI_API_KEY=your_gemini_api_key

npm run dev
```

Then visit **http://localhost:3000**.

---

## ⚙️ Environment Variables

| Variable | Description |
|-----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT encryption key |
| `GEMINI_API_KEY` | Google Gemini API key |
| `RAPIDAPI_KEY` | Judge0 API key |
| `PORT` | Backend port |
| `VITE_API_URL` | Frontend API base URL |

---


## 🚢 Deployment

### Build & Deploy
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm start
```

**Recommended Hosting:**
- Frontend → Vercel / Netlify  
- Backend → Render / Railway / DigitalOcean  
- Database → MongoDB Atlas  

---

## 🤝 Contributing

1. Fork the repo  
2. Create a branch → `git checkout -b feature/new-feature`  
3. Commit changes → `git commit -m "Added new feature"`  
4. Push → `git push origin feature/new-feature`  
5. Open a Pull Request  

---

## 📜 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE).

---

## 👨‍💻 Author

**Harsh Sharma**  
🔗 [GitHub Profile](https://github.com/Harsh-sh7)  
💡 Project Repo: [NotAI](https://github.com/Harsh-sh7/NotAI)

---

## 🙏 Acknowledgments

- Google Gemini AI  
- Judge0 API  
- React & TypeScript Communities  
- Tailwind CSS & Vite  
- MongoDB Atlas  

---
