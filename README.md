# ⚡ EventHub — Full-Stack Event Management System

A production-ready Event Management System built using the **MERN Stack** (MongoDB, Express, React, Node.js). It features a modern, dark-themed glassmorphism UI and a robust Role-Based Access Control (RBAC) system supporting Admins, Vendors, and Users.

## 🌟 Key Features

*   **Role-Based Portals**: Dedicated authentication flows and dashboards for three distinct roles.
    *   **⚙️ Admin**: Full platform oversight, user management, and global statistics.
    *   **🏪 Vendor**: Product listing (auto-approved), inventory management, and status tracking.
    *   **🛍️ User**: Browse listings, add to cart, checkout, order tracking, and membership subscriptions.
*   **Secure Authentication**: JWT-based authentication with encrypted passwords (bcrypt), HTTP interceptors for automatic token attachment, and protected routing.
*   **Modern UI/UX**: Custom CSS architecture featuring dark mode, glassmorphism card designs, smooth micro-animations, and fully responsive layouts.
*   **Database Management**: Mongoose schemas for Users, Products, Orders, Memberships, and Carts with robust relational referencing.

---

## 🏗️ Project Architecture

The project is structured as a monorepo containing two main directories:

### `/client` (Frontend)
Built with React.js, React Router v6, and Axios.
*   `src/components/`: Reusable UI elements (Navbar, ProtectedRoute, ProductCard).
*   `src/pages/`: Role-specific dashboards and core application views.
*   `src/context/`: Global state management for Authentication.
*   `src/services/`: Centralized Axios API calls with automatic 401 redirect handling.

### `/server` (Backend)
Built with Node.js and Express.js.
*   `models/`: Mongoose schemas.
*   `controllers/`: Core business logic and database interactions.
*   `routes/`: Modularized API endpoints.
*   `middleware/`: JWT verification and RBAC role checking.

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your machine (or a MongoDB Atlas account).

### 2. Installation
Install dependencies for both the backend and frontend:

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Environment Variables
In the `/server` directory, create a `.env` file with the following variables:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/?appName=<appname>
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
```
*(Note: If your MongoDB password contains special characters like `@`, be sure to URL-encode them, e.g., `%40`)*.

### 4. Running the Application

**Start the Backend Server (Port 5000):**
```bash
cd server
npm run dev
```

**Start the React Frontend (Port 3000):**
```bash
cd client
npm start
```

---

## 🛠️ Tech Stack

*   **Frontend**: React.js, React Router DOM, Axios, Vanilla CSS (CSS Variables)
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB, Mongoose
*   **Security**: JSON Web Tokens (JWT), bcryptjs, Express-Validator

---

## 📝 Usage Notes & Default Setup
To create an Admin account, register a standard User account via the frontend, then manually update the `role` field to `"admin"` directly within your MongoDB database. After this, you can manage the platform through the Admin Portal.
