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
