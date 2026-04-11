import "../loadEnv.js";
import path from "node:path";

import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

import { UPLOADS_DIR } from "./database.js";

const isProduction = process.env.NODE_ENV === "production";
const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim() || "";
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY?.trim() || "";
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET?.trim() || "";
const cloudinaryFolder =
  process.env.CLOUDINARY_FOLDER?.trim() || "other-half/support-attachments";
const allowLocalUploadStorage = ["1", "true", "yes", "on"].includes(
  String(process.env.ALLOW_LOCAL_UPLOAD_STORAGE || "")
    .trim()
    .toLowerCase()
);

export const isCloudinaryUploadConfigured = Boolean(
  cloudinaryCloudName && cloudinaryApiKey && cloudinaryApiSecret
);

if (isCloudinaryUploadConfigured) {
  cloudinary.config({
    cloud_name: cloudinaryCloudName,
    api_key: cloudinaryApiKey,
    api_secret: cloudinaryApiSecret,
    secure: true,
  });
}

const createHttpError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const allowedSupportAttachmentMimeTypes = new Set([
  "application/msword",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain",
]);

const diskStorage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, UPLOADS_DIR);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname);
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  },
});

const selectedStorage = isCloudinaryUploadConfigured ? multer.memoryStorage() : diskStorage;

export const supportUpload = multer({
  storage: selectedStorage,
  limits: {
    fileSize: 8 * 1024 * 1024,
    files: 5,
  },
  fileFilter: (_req, file, callback) => {
    if (!allowedSupportAttachmentMimeTypes.has(String(file.mimetype || "").toLowerCase())) {
      callback(
        createHttpError("Only JPG, PNG, WEBP, PDF, TXT, DOC, and DOCX files are allowed.")
      );
      return;
    }

    callback(null, true);
  },
});

const uploadFileToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: cloudinaryFolder,
        resource_type: "auto",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) {
          reject(
            createHttpError(
              error?.message || "Support attachment could not be uploaded to Cloudinary.",
              502
            )
          );
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(file.buffer);
  });
};

export const mapSupportRequestAttachments = async (files = []) => {
  if (!Array.isArray(files) || files.length === 0) {
    return [];
  }

  if (isCloudinaryUploadConfigured) {
    return Promise.all(
      files.map(async (file) => {
        const uploadedAsset = await uploadFileToCloudinary(file);

        return {
          storage: "cloudinary",
          fileName: "",
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          url: uploadedAsset.secure_url,
          publicId: uploadedAsset.public_id,
        };
      })
    );
  }

  if (isProduction && !allowLocalUploadStorage) {
    throw createHttpError(
      "Support attachments need Cloudinary in production. Configure Cloudinary or explicitly allow local upload storage.",
      503
    );
  }

  return files.map((file) => ({
    storage: "local",
    fileName: file.filename,
    originalName: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    url: file.filename ? `/uploads/${file.filename}` : "",
    publicId: "",
  }));
};

export const getUploadStorageMode = () => {
  if (isCloudinaryUploadConfigured) {
    return "cloudinary";
  }

  if (isProduction && !allowLocalUploadStorage) {
    return "disabled";
  }

  return "local";
};
