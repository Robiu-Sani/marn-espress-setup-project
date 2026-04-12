# Documentation 

  cd project-name
  code .
## 1.setup env
- then change .env.example to .env
- port 
  PORT=5000
  - development part
  NODE_ENV=development
- fronend url 
  FRONTEND_URL=http://localhost:3000
-thoes are simple setup
#### setup mongoose uri
- go https://www.mongodb.com/products/platform/atlas-database
- create account or singin ( recomendaded to create with google account)
- from left go database and network access
- create a user to access data
- then click ip list and there add ip address . if data for access from alll over then (0.0.0.0/0)
- then click Clusters from left bar
- click connect to connect then click drive then copy then change username and password then click done
- and click brows connection to brows data

##### seconde option to install mongodb in local computer 
- (there add me all setup step by step)
DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/my-database


SALT_WORK_FACTOR=12
GENERATE_PASS=your_random_string
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_FORGET_PASSWORD_SECRET=your_super_secret_forget_key



# --- TOKEN EXPIRATION ---
EXPIRE_ACCESS_TOKEN_IN=15m
EXPIRE_REFRESH_TOKEN_IN=7d
EXPIRE_FORGET_PASSWORD_TOKEN_IN=10m



USER_EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
STEMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# --- CLOUDINARY CONFIGURATION ---
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# --- IMAGE HOSTING (FREEIMAGEHOST) ---
FREEIMAGEHOSTAPIKEY=your_free_image_host_key
FREEIMAGEHOSTURL=https://freeimagehost.com/api/1/upload

# --- AI INTEGRATION ---
GEMINI_API_KEY=your_google_gemini_api_key 
