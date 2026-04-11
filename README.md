# 🚀 MERN Express Starter 

Welcome to your newly generated project! This boilerplate provides a robust, production-ready foundation for building full-stack applications with the MERN stack.

## 🛠️ Tech Stack
- **Backend:** Node.js & Express.js
- **Database:** MongoDB with Mongoose ORM
- **Authentication:** JWT (Access/Refresh Tokens)
- **Utilities:** Zod (Validation) - optional, Cloudinary (Images), Gemini AI
- **Environment:** Dotenv & Cross-Env

---

## ⚙️ Getting Started

### 1. Environment Setup
The project requires several environment variables to function correctly. 
1. Copy the example environment file:
   ```bash
   cp .env.example 
   ```
2. create `.env` and fill in your credentials (MongoDB URL, JWT Secrets, API Keys).

### 2. Installation
Install the project dependencies:(it will install automaticly )
```bash
npm install
```

### 3. Running the Project
- **Development Mode (with auto-reload):**
  ```bash
  npm run dev
  ```
- **Production Mode:**
  ```bash
  npm run build
  npm start
  ```

---

## 📂 Project Structure
```text
├── src/
│   ├── app.ts            # Main Express application logic
│   ├── config/         # Environment & Database configurations
│   ├── modules/        # Feature-based folders (User, Auth, etc.)
│   ├── middlewares/    # Custom Express middlewares (Auth, Error handling)
│   ├── utils/          # Helper functions (Cloudinary, Gemini, etc.)
│   └── server.ts/js    # Entry point
├── .env.example        # Template for environment variables
└── package.json        # Project dependencies and scripts
```

---

## 🔑 Environment Variables Guide

To ensure the project works as expected, make sure to configure these key sections in your `.env`:

- **Database:** Set `DB_URL` to your MongoDB connection string.
- **Security:** Generate unique strings for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.
- **Integrations:**
    - **Cloudinary:** Required for image uploads.
    - **Gemini:** Required if you are using AI features.
    - **Email:** Configure SMTP settings for password resets.

---

## 🤝 Support
Created by **Robius Sani** (Founder of **Code Biruni**).  
For issues or feature requests, please visit the official [Code Biruni GitHub](https://github.com/Robiu-Sani).

---

## 🛡️ License
This project is licensed under the ISC License.


### Why this is perfect for the user:
* **The "cp" Command:** It tells the user exactly how to handle the `.env` file you just designed.
* **Folder Structure:** It explains the "Feature-based" architecture, which is a senior-level way to organize code.
* **Clear Scripts:** It lists exactly what to type to get started.

### How to use this:
You should put this file inside your **template repository** (the one your CLI clones from). That way, when a user runs your CLI, they get this documentation inside their new project folder immediately.

