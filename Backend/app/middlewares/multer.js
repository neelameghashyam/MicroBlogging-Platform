import multer from "multer";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Store files in uploads/ folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Generate unique filename
    }
});

// Initialize multer without file size limit or file filter
const upload = multer({
    storage
});

export default upload;
