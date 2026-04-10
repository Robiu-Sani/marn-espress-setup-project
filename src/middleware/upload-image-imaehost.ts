import multer from "multer";
import axios from "axios";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import { Request, Response, NextFunction } from "express";
import config from "../config";
import catchAsync from "../utils/catchAsync";

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
    const sanitizedOriginalName = file.originalname.replace(
      /[^a-zA-Z0-9.]/g,
      "_"
    );
    const unique = Date.now() + "-" + sanitizedOriginalName;
    cb(null, unique);
  },
});

// ------------------------------------
// File Filter (Security)
// ------------------------------------
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|jfif|png|webp|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// ------------------------------------
// Core Upload Function
// ------------------------------------
export const uploadSingleImageToService = async (
  imagePath: string
): Promise<string> => {
  try {
    // 🔥 Pulling directly from config now
    const apikey = config.freeimagehost_api_key;
    const apiurl = config.freeimagehost_url;

    if (!apikey || !apiurl) {
      throw new Error("Image hosting API configuration missing in config file");
    }

    const formData = new FormData();
    formData.append("source", fs.createReadStream(imagePath));
    formData.append("key", apikey);
    formData.append("format", "json");

    const uploadRes = await axios.post(apiurl, formData, {
      headers: formData.getHeaders(),
    });

    if (!uploadRes.data?.image?.url) {
      throw new Error("Invalid response from image hosting service");
    }

    return uploadRes.data.image.url;
  } finally {
    // Always cleanup temp file
    try {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    } catch (err) {
      console.error("Temp file delete error:", err);
    }
  }
};

// ------------------------------------
// Single Upload Middleware (Single Field)
// ------------------------------------
export const uploadImageSingle = (fieldName: string = "image") => {
  return [
    upload.single(fieldName),
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const file = req.file as Express.Multer.File | undefined;

      if (!file) {
        return next();
      }

      try {
        const imageUrl = await uploadSingleImageToService(file.path);
        req.body[fieldName] = imageUrl;
        next();
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Error uploading image",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }),
  ];
};

// ------------------------------------
// Multiple Images Middleware (One Field, Multiple Files)
// ------------------------------------
export const uploadImageMultiple = (fieldName: string = "images") => {
  return [
    upload.array(fieldName),
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const files = req.files as Express.Multer.File[] | undefined;

      if (!files || files.length === 0) {
        return next();
      }

      try {
        const uploadPromises = files.map((file) =>
          uploadSingleImageToService(file.path)
        );

        const uploadedLinks = await Promise.all(uploadPromises);
        req.body[fieldName] = uploadedLinks;
        next();
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Error uploading one or more images",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }),
  ];
};

// ------------------------------------
// Multiple Fields Middleware (Array of field names)
// ------------------------------------
export const uploadImageFields = (fieldNames: string[]) => {
  // Map strings to Multer field config: [{ name: 'logo', maxCount: 1 }, ...]
  const fieldsConfig = fieldNames.map((name) => ({ name, maxCount: 1 }));

  return [
    upload.fields(fieldsConfig),
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const filesMap = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

      if (!filesMap || Object.keys(filesMap).length === 0) {
        return next();
      }

      try {
        const fieldProcessingPromises = Object.keys(filesMap).map(async (key) => {
          const file = filesMap[key][0]; // Getting the first image for that field
          if (file) {
            const imageUrl = await uploadSingleImageToService(file.path);
            req.body[key] = imageUrl; // Setting the URL to the body key
          }
        });

        await Promise.all(fieldProcessingPromises);
        next();
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Error uploading multi-field images",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }),
  ];
};

// ------------------------------------
// Service Usage (Direct Call)
// ------------------------------------
export const uploadImageSingleInService = async (
  imagePath: string
): Promise<string> => {
  try {
    return await uploadSingleImageToService(imagePath);
  } catch (error) {
    console.error("Service image upload error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Image upload failed"
    );
  }
};