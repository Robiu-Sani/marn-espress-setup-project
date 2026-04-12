# Complete Environment Setup Documentation

## 📋 Table of Contents
1. [Environment Configuration](#environment-configuration)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [Local MongoDB Setup](#local-mongodb-setup)
4. [Email Configuration](#email-configuration)
5. [Cloudinary Setup](#cloudinary-setup)
6. [FreeImageHost Setup](#freeimagehost-setup)
7. [Google Gemini AI Setup](#google-gemini-ai-setup)
8. [Complete .env File Example](#complete-env-file-example)
9. [Environment Validation Script](#Environment Validation Script)
10. [Simple .env Setup Notes (Plain Text)](#Simple .env Setup Notes (Plain Text))

---

---

## 1. Environment Configuration

### Step 1: Create `.env` file and Delete `.env.example`
```bash
# Copy from example file
cp .env.example .env
```

### Step 2: Basic configuration
```env
# ====================
# SERVER CONFIGURATION
# ====================
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Backend URL
BACKEND_URL=http://localhost:5000
```

### Step 3: Generate secure random strings
```bash
# Generate random string for passwords (run in terminal)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Example output: a7f3e8d2c1b9a4f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0
```

---

## 2. MongoDB Atlas Setup (Cloud)

### Step-by-step guide:

#### 1. Create Account
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Click "Try Free" or "Sign Up"
- Sign in with Google account (recommended)

#### 2. Create Cluster
- After login, click "Create Cluster"
- Select FREE tier (M0)
- Choose cloud provider (AWS, GCP, or Azure)
- Select region closest to you
- Click "Create Cluster" (takes 1-3 minutes)

#### 3. Database Access
- In left sidebar, click "Database Access"
- Click "Add New Database User"
- Choose authentication method: "Password"
- Enter username: `admin` (or your choice)
- Enter password: `SecurePass123!` (create strong password)
- Set privileges: "Read and write to any database"
- Click "Add User"

#### 4. Network Access (IP Whitelist)
- In left sidebar, click "Network Access"
- Click "Add IP Address"
- For development: Click "Allow Access from Anywhere"
  - IP: `0.0.0.0/0`
- For production: Add specific IP addresses only
- Click "Confirm"

#### 5. Get Connection String
- In left sidebar, click "Database"
- Click "Connect" button for your cluster
- Select "Drivers" option
- Copy the connection string:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/my-database
```

#### 6. Replace placeholders
```env
DB_URL=mongodb+srv://admin:SecurePass123!@cluster0.xxxxx.mongodb.net/my-database?retryWrites=true&w=majority
```

**Note:** Change `my-database` to your database name (e.g., `ecommerce_db`, `blog_db`)

---

## 3. Local MongoDB Setup (Alternative)

### For Windows:

#### Option 1: Download MongoDB Community Edition
1. Go to [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Download MSI installer for Windows
3. Run installer with "Complete" setup
4. Install as service (recommended)
5. Add MongoDB to PATH (checked by default)

#### Option 2: Install via Chocolatey
```bash
# Install MongoDB
choco install mongodb

# Install MongoDB Compass (GUI)
choco install mongodb-compass
```

### For macOS:

#### Option 1: Homebrew
```bash
# Tap MongoDB
brew tap mongodb/brew

# Install MongoDB
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community
```

#### Option 2: Download manually
```bash
# Download from MongoDB website
curl -O https://fastdl.mongodb.org/osx/mongodb-macos-x86_64-7.0.0.tgz

# Extract
tar -zxvf mongodb-macos-x86_64-7.0.0.tgz

# Move to /usr/local
sudo mv mongodb-macos-x86_64-7.0.0 /usr/local/mongodb

# Add to PATH
export PATH=/usr/local/mongodb/bin:$PATH
```

### For Linux (Ubuntu/Debian):

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update packages
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod

# Enable on boot
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod
```

### Local MongoDB Connection String:
```env
# Default local connection (no auth)
DB_URL=mongodb://localhost:27017/my-database

# With authentication
DB_URL=mongodb://username:password@localhost:27017/my-database?authSource=admin
```

### Create database user (local):
```bash
# Connect to MongoDB
mongosh

# Use admin database
use admin

# Create user
db.createUser({
  user: "myuser",
  pwd: "mypassword",
  roles: [{ role: "readWrite", db: "my-database" }]
})

# Exit
exit
```

---

## 4. Email Configuration (Gmail)

### Generate App Password for Gmail:

1. **Enable 2-Factor Authentication:**
   - Go to [Google Account](https://myaccount.google.com/)
   - Click "Security" in left sidebar
   - Enable "2-Step Verification"
   - Follow setup process

2. **Create App Password:**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select app: "Mail"
   - Select device: "Other" (name it "Node.js App")
   - Click "Generate"
   - Copy the 16-character password (no spaces)

### Email Configuration in `.env`:
```env
# ====================
# EMAIL CONFIGURATION
# ====================
USER_EMAIL=your_email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop  # Your 16-character app password
STEMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

### Test email configuration:
```javascript
// test-email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

async function testEmail() {
  try {
    await transporter.verify();
    console.log('Email configured successfully!');
  } catch (error) {
    console.error('Email error:', error);
  }
}

testEmail();
```

---

## 5. Cloudinary Setup (Image Hosting)

### Step-by-step guide:

1. **Create Account:**
   - Go to [Cloudinary](https://cloudinary.com/)
   - Click "Sign Up" (free tier available)
   - Sign up with Google or email

2. **Get Credentials:**
   - After login, go to Dashboard
   - Find your credentials:
     - **Cloud name**: `your_cloud_name`
     - **API Key**: `123456789012345`
     - **API Secret**: `abc123def456ghi789`

### Cloudinary Configuration:
```env
# ====================
# CLOUDINARY CONFIGURATION
# ====================
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abc123def456ghi789
```

### Install Cloudinary:
```bash
npm install cloudinary
```

### Upload test:
```javascript
// test-cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function testUpload() {
  try {
    const result = await cloudinary.uploader.upload('path/to/image.jpg');
    console.log('Upload successful:', result.secure_url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
}
```

---

## 6. FreeImageHost Setup (Alternative)

### Step-by-step guide:

1. **Create Account:**
   - Go to [FreeImageHost](https://freeimage.host/)
   - Click "Sign Up"
   - Complete registration

2. **Get API Key:**
   - Login to your account
   - Go to "Settings" → "API"
   - Click "Generate API Key"
   - Copy your API key

### FreeImageHost Configuration:
```env
# ====================
# IMAGE HOSTING (FREEIMAGEHOST)
# ====================
FREEIMAGEHOSTAPIKEY=your_32_character_api_key_here
FREEIMAGEHOSTURL=https://freeimage.host/api/1/upload
```

### Upload using FreeImageHost:
```javascript
// test-freeimagehost.js
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function uploadToFreeImageHost(imagePath) {
  const formData = new FormData();
  formData.append('key', process.env.FREEIMAGEHOSTAPIKEY);
  formData.append('source', fs.createReadStream(imagePath));
  formData.append('format', 'json');

  try {
    const response = await axios.post(process.env.FREEIMAGEHOSTURL, formData, {
      headers: formData.getHeaders()
    });
    console.log('Upload successful:', response.data.image.url);
    return response.data;
  } catch (error) {
    console.error('Upload failed:', error);
  }
}
```

---

## 7. Google Gemini AI Setup

### Step-by-step guide:

1. **Get Gemini API Key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with Google account
   - Click "Create API Key"
   - Select or create a project
   - Copy your API key

2. **Alternative: Google Cloud Console:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing
   - Enable "Generative Language API"
   - Go to "Credentials"
   - Create API key

### Gemini Configuration:
```env
# ====================
# AI INTEGRATION
# ====================
GEMINI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz12345678
```

### Install Gemini SDK:
```bash
npm install @google/generative-ai
```

### Test Gemini AI:
```javascript
// test-gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = "Explain MongoDB in simple terms";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log("AI Response:", response.text());
  } catch (error) {
    console.error("Gemini error:", error);
  }
}

testGemini();
```

---

## 8. Complete .env File Example

```env
# ====================
# SERVER CONFIGURATION
# ====================
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# ====================
# DATABASE CONFIGURATION
# ====================
# MongoDB Atlas (Cloud)
DB_URL=mongodb+srv://admin:SecurePass123!@cluster0.xxxxx.mongodb.net/my-database?retryWrites=true&w=majority

# OR Local MongoDB
# DB_URL=mongodb://localhost:27017/my-database

# ====================
# BCRYPT CONFIGURATION
# ====================
SALT_WORK_FACTOR=12

# ====================
# JWT SECRETS (Generate with crypto.randomBytes(32).toString('hex'))
# ====================
GENERATE_PASS=a7f3e8d2c1b9a4f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0
JWT_ACCESS_SECRET=8c9b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8
JWT_REFRESH_SECRET=3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3
JWT_FORGET_PASSWORD_SECRET=d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8

# ====================
# TOKEN EXPIRATION
# ====================
EXPIRE_ACCESS_TOKEN_IN=15m
EXPIRE_REFRESH_TOKEN_IN=7d
EXPIRE_FORGET_PASSWORD_TOKEN_IN=10m

# ====================
# EMAIL CONFIGURATION (Gmail)
# ====================
USER_EMAIL=your_email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
STEMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# ====================
# CLOUDINARY CONFIGURATION
# ====================
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abc123def456ghi789

# ====================
# IMAGE HOSTING (FREEIMAGEHOST)
# ====================
FREEIMAGEHOSTAPIKEY=your_32_character_api_key_here
FREEIMAGEHOSTURL=https://freeimage.host/api/1/upload

# ====================
# AI INTEGRATION (Google Gemini)
# ====================
GEMINI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz12345678

# ====================
# OPTIONAL: Rate Limiting
# ====================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ====================
# OPTIONAL: File Upload Limits
# ====================
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,image/webp
```

---

## 9. Environment Validation Script

- if anything you add in env then you can configer in `config/index.ts`:

```typescript
import dotenv from 'dotenv';
import Path from 'path';

dotenv.config({ path: Path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  database_url: process.env.DB_URL,
  salt_factor: Number(process.env.SALT_WORK_FACTOR),
  gen_pass: process.env.GENERATE_PASS as string,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET as string,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET as string,
  jwt_forget_password_secret: process.env.JWT_FORGET_PASSWORD_SECRET as string,
  frontend_url: process.env.FRONTEND_URL,
  expire_access_in: process.env.EXPIRE_ACCESS_TOKEN_IN as string,
  expire_refresh_in: process.env.EXPIRE_REFRESH_TOKEN_IN as string,
  expire_forget_password_in: process.env.EXPIRE_FORGET_PASSWORD_TOKEN_IN as string,
  node_env: process.env.NODE_ENV,
  user_email: process.env.USER_EMAIL as string,
  email_password: process.env.EMAIL_PASSWORD as string,
  email_host: process.env.STEMAIL_HOST as string,
  email_port: process.env.EMAIL_PORT,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY as string,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET as string,
  freeimagehost_api_key: process.env.FREEIMAGEHOSTAPIKEY as string,
  freeimagehost_url: process.env.FREEIMAGEHOSTURL as string,
  gemini_api_key: process.env.GEMINI_API_KEY as string,
};
```
- to generate token secret `# Run this in terminal
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
---


## 10. Simple .env Setup Notes (Plain Text)

===========================================
QUICK START
===========================================

1. cd project-name
2. code .
3. cp .env.example .env

===========================================
BASIC SETUP
===========================================

PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

===========================================
MONGODB ATLAS SETUP (CLOUD)
===========================================

Step 1: Go to mongodb.com/atlas
Step 2: Sign up with Google account
Step 3: Create free cluster (M0)
Step 4: Go to Database Access -> Add user (username/password)
Step 5: Go to Network Access -> Add IP 0.0.0.0/0
Step 6: Click Connect -> Drivers -> Copy connection string

DB_URL=mongodb+srv://username:password@cluster.mongodb.net/database_name

===========================================
MONGODB LOCAL SETUP
===========================================

Windows: Download from mongodb.com
macOS: brew install mongodb-community
Linux: sudo apt-get install mongodb-org

DB_URL=mongodb://localhost:27017/database_name

===========================================
GENERATE SECRET KEYS
===========================================

Run in terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Copy output to:

JWT_ACCESS_SECRET=pasted_key_here
JWT_REFRESH_SECRET=pasted_key_here
JWT_FORGET_PASSWORD_SECRET=pasted_key_here

SALT_WORK_FACTOR=12

===========================================
TOKEN EXPIRATION
===========================================

EXPIRE_ACCESS_TOKEN_IN=15m
EXPIRE_REFRESH_TOKEN_IN=7d
EXPIRE_FORGET_PASSWORD_TOKEN_IN=10m

===========================================
GMAIL SETUP
===========================================

Step 1: Enable 2FA on your Google account
Step 2: Go to myaccount.google.com/apppasswords
Step 3: Select Mail -> Other -> Name it "Node App"
Step 4: Copy 16-character password

USER_EMAIL=your_email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
STEMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

===========================================
CLOUDINARY SETUP
===========================================

Step 1: Sign up at cloudinary.com
Step 2: Get credentials from Dashboard

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abc123def456ghi789

===========================================
FREEIMAGEHOST SETUP
===========================================

Step 1: Sign up at freeimage.host
Step 2: Settings -> API -> Generate API Key

FREEIMAGEHOSTAPIKEY=your_32_character_key
FREEIMAGEHOSTURL=https://freeimage.host/api/1/upload

===========================================
GOOGLE GEMINI AI SETUP
===========================================

Step 1: Go to makersuite.google.com/app/apikey
Step 2: Sign in with Google
Step 3: Click Create API Key

GEMINI_API_KEY=AIzaSyA...your_key_here

===========================================
COMPLETE .env EXAMPLE
===========================================

PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

DB_URL=mongodb+srv://admin:password123@cluster0.abc.mongodb.net/mydb

SALT_WORK_FACTOR=12
JWT_ACCESS_SECRET=a7f3e8d2c1b9a4f6e7d8c9b0a1f2e3d4
JWT_REFRESH_SECRET=8c9b7a6f5e4d3c2b1a0f9e8d7c6b5a4f
JWT_FORGET_PASSWORD_SECRET=3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8

EXPIRE_ACCESS_TOKEN_IN=15m
EXPIRE_REFRESH_TOKEN_IN=7d
EXPIRE_FORGET_PASSWORD_TOKEN_IN=10m

USER_EMAIL=test@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
STEMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

CLOUDINARY_CLOUD_NAME=mycloud
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abcdef123456

FREEIMAGEHOSTAPIKEY=abc123def456ghi789jkl012
FREEIMAGEHOSTURL=https://freeimage.host/api/1/upload

GEMINI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz12345678

===========================================
QUICK COMMANDS
===========================================

Generate secret key:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Test MongoDB:
mongosh --eval "db.runCommand({ping: 1})"

Start MongoDB (macOS):
brew services start mongodb-community

Start MongoDB (Linux):
sudo systemctl start mongod

===========================================
COMMON ISSUES
===========================================

MongoDB error -> Check IP whitelist (add 0.0.0.0/0)
Email error -> Use App Password, not regular password
JWT error -> Regenerate with crypto.randomBytes
CORS error -> Check FRONTEND_URL is correct


