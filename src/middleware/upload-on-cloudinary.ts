import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";
import config from "../config";
import catchAsync from "../utils/catchAsync";

// ------------------------------------
// Cloudinary Configuration
// ------------------------------------
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

// ------------------------------------
// Ensure temp directory exists
// ------------------------------------
const tempDir = path.join(process.cwd(), "tmp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// ------------------------------------
// Multer Storage
// ------------------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
    cb(null, unique);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|jfif|png|webp|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ------------------------------------
// Core Cloudinary Upload Function
// ------------------------------------
export const uploadToCloudinary = async (imagePath: string): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "mern_setup", // Optional: specify a folder name in Cloudinary
      resource_type: "auto",
    });

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  } finally {
    // Cleanup local temp file
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
};

// ------------------------------------
// Middleware: Single Image (One Field)
// ------------------------------------
export const uploadImageSingle = (fieldName: string = "image") => {
  return [
    upload.single(fieldName),
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      if (!req.file) return next();

      try {
        const imageUrl = await uploadToCloudinary(req.file.path);
        req.body[fieldName] = imageUrl;
        next();
      } catch (error) {
        return res.status(500).json({ success: false, message: "Upload failed", error });
      }
    }),
  ];
};

// ------------------------------------
// Middleware: Multiple Images (One Field)
// ------------------------------------
export const uploadImageMultiple = (fieldName: string = "images") => {
  return [
    upload.array(fieldName),
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const files = req.files as Express.Multer.File[] | undefined;
      if (!files || files.length === 0) return next();

      try {
        const uploadPromises = files.map((file) => uploadToCloudinary(file.path));
        req.body[fieldName] = await Promise.all(uploadPromises);
        next();
      } catch (error) {
        return res.status(500).json({ success: false, message: "Multi-upload failed", error });
      }
    }),
  ];
};

// ------------------------------------
// Middleware: Multiple Fields (Array of keys)
// ------------------------------------
export const uploadImageFields = (fieldNames: string[]) => {
  const fieldsConfig = fieldNames.map((name) => ({ name, maxCount: 1 }));

  return [
    upload.fields(fieldsConfig),
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const filesMap = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      if (!filesMap) return next();

      try {
        const fieldProcessingPromises = Object.keys(filesMap).map(async (key) => {
          const file = filesMap[key][0];
          if (file) {
            req.body[key] = await uploadToCloudinary(file.path);
          }
        });

        await Promise.all(fieldProcessingPromises);
        next();
      } catch (error) {
        return res.status(500).json({ success: false, message: "Field upload failed", error });
      }
    }),
  ];
};