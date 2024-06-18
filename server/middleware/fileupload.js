import multer from 'multer';

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Files will be saved in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        const sanitizedFilename = file.originalname.replace(/\s/g, '_');
        cb(null, new Date().toISOString().replace(/[:.]/g, '_') + sanitizedFilename)

    }
});

// for selecting file type discarding all other files except jpeg and png
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

// Initialize multer with the storage configuration
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});