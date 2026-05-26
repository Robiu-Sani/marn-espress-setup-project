import dotenv from 'dotenv';
import Path from 'path';

dotenv.config({ path: Path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT || 5000,
  database_url: process.env.DB_URL || 'mongodb://localhost:27017/mern-setup',
  salt_factor: Number(process.env.SALT_WORK_FACTOR) || 10,
  gen_pass: process.env.GENERATE_PASS as string || 'your_default_password',
  jwt_access_secret: process.env.JWT_ACCESS_SECRET as string || 'your_access_secret',
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET as string || 'your_refresh_secret',
  jwt_forget_password_secret: process.env.JWT_FORGET_PASSWORD_SECRET as string || 'your_forget_password_secret',
  frontend_url: process.env.FRONTEND_URL || 'http://localhost:3000',
  expire_access_in: process.env.EXPIRE_ACCESS_TOKEN_IN as string || '1h',
  expire_refresh_in: process.env.EXPIRE_REFRESH_TOKEN_IN as string || '7d',
  expire_forget_password_in: process.env.EXPIRE_FORGET_PASSWORD_TOKEN_IN as string || '1h',
  node_env: process.env.NODE_ENV || 'development',
  user_email: process.env.USER_EMAIL as string || 'your_email@example.com',
  email_password: process.env.EMAIL_PASSWORD as string || 'your_email_password',
  email_host: process.env.STEMAIL_HOST as string || 'smtp.gmail.com',
  email_port: process.env.EMAIL_PORT || 587,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string || 'your_cloudinary_cloud_name',
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY as string || 'your_cloudinary_api_key',
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET as string || 'your_cloudinary_api_secret',
  freeimagehost_api_key: process.env.FREEIMAGEHOSTAPIKEY as string || 'your_freeimagehost_api_key',
  freeimagehost_url: process.env.FREEIMAGEHOSTURL as string || 'https://freeimagehost.com/api/1/upload',
  gemini_api_key: process.env.GEMINI_API_KEY as string || 'your_gemini_api_key',
};
