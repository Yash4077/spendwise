# 💰 SpendWise — Personal Expense Tracker

A full-stack MERN web application for tracking personal income and expenses with user authentication, CRUD operations, and monthly summaries.

---

## 🔧 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Axios |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB Atlas (Mongoose ODM)        |
| Auth       | JWT (JSON Web Tokens) + bcryptjs    |

---

## ✅ Features

- User Signup & Login with JWT authentication
- Add, View, Edit, Delete transactions (full CRUD)
- Income and Expense categorization
- Monthly filter (by month & year)
- Summary cards: Total Income, Total Expense, Net Balance
- Protected routes — only logged-in users can access dashboard
- Responsive design with Tailwind CSS

---

## 📁 Project Structure

```
spendwise/
├── backend/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/User.js
│   ├── models/Transaction.js
│   ├── routes/auth.js
│   ├── routes/transactions.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── SummaryCards.jsx
    │   │   ├── TransactionModal.jsx
    │   │   └── TransactionItem.jsx
    │   ├── context/AuthContext.jsx
    │   ├── pages/Login.jsx
    │   ├── pages/Register.jsx
    │   ├── pages/Dashboard.jsx
    │   ├── utils/api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    └── package.json
```

---

## 🚀 Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/spendwise.git
cd spendwise
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# .env already has VITE_API_URL=http://localhost:5000/api
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 🌐 Deployment Guide

### Step 1 — MongoDB Atlas (Database)
1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and create a free account
2. Create a new **free cluster** (M0)
3. Create a database user with username & password
4. Under **Network Access**, allow `0.0.0.0/0`
5. Go to **Connect → Drivers** and copy your connection string
6. Replace `<password>` with your DB user password

### Step 2 — Deploy Backend on Render (Free)
1. Go to [https://render.com](https://render.com) and sign up
2. Click **New → Web Service**
3. Connect your GitHub repo → select the `backend` folder
4. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Root Directory:** `backend`
5. Add **Environment Variables**:
   ```
   MONGO_URI = your_mongodb_atlas_connection_string
   JWT_SECRET = any_random_strong_string_eg_spendwise2024xyz
   CLIENT_URL = https://your-vercel-frontend-url.vercel.app
   PORT = 5000
   ```
6. Click **Create Web Service** — copy the live URL (e.g., `https://spendwise-api.onrender.com`)

### Step 3 — Deploy Frontend on Vercel (Free)
1. Go to [https://vercel.com](https://vercel.com) and sign up with GitHub
2. Click **New Project** → Import your repo → select the `frontend` folder
3. Settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add **Environment Variable**:
   ```
   VITE_API_URL = https://spendwise-api.onrender.com/api
   ```
5. Click **Deploy** — your app is live!

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint             | Description      | Auth Required |
|--------|----------------------|------------------|---------------|
| POST   | /api/auth/register   | Register user    | No            |
| POST   | /api/auth/login      | Login user       | No            |
| GET    | /api/auth/me         | Get current user | Yes           |

### Transactions
| Method | Endpoint                    | Description            | Auth Required |
|--------|-----------------------------|------------------------|---------------|
| GET    | /api/transactions           | Get all transactions   | Yes           |
| GET    | /api/transactions/summary   | Get income/expense sum | Yes           |
| POST   | /api/transactions           | Create transaction     | Yes           |
| PUT    | /api/transactions/:id       | Update transaction     | Yes           |
| DELETE | /api/transactions/:id       | Delete transaction     | Yes           |

---

## 👨‍💻 Developer

Built as part of Full-Stack Web Development coursework — MERN Stack  
**G H Raisoni International Skill Tech University, Pune**
