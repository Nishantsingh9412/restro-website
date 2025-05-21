import multer from "multer";

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Use path.join for cross-platform compatibility
  },
  filename: (req, file, cb) => {
    const sanitizedFilename = file.originalname.replace(/\s/g, "_");
    cb(
      null,
      `${new Date().toISOString().replace(/[:.]/g, "_")}_${sanitizedFilename}`
    );
  },
});

// File filter to allow only jpeg and png files
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ];
  cb(null, allowedMimeTypes.includes(file.mimetype));
};

// Initialize multer with the storage configuration
export const upload = multer({
  storage,
  fileFilter,
});
