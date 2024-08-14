import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuid } from 'uuid';

const fileExtensions = (mimeType) => {
    switch (mimeType) {
        case 'image/png':
            return '.png';
        case 'image/jpeg':
            return '.jpeg';
        case 'image/jpg':
            return '.jpeg';
        case 'image/webp':
            return '.webp';
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(import.meta.dirname || path.dirname(fileURLToPath(import.meta.url)), '..', 'temp', 'images'));
    },
    filename: (req, file, cb) => {
        const name = `${file.fieldname}-${uuid()}${fileExtensions(file.mimetype)}`;
        cb(null, name);
    },
});

const upload = multer({ storage: storage });

export default upload;
