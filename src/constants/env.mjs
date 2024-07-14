import 'dotenv/config';


export const { DB_URI } = process.env;
export const { PORT } = process.env; 
export const { NODE_ENV } = process.env;
export const { JWT_SECRET } = process.env
export const JWT_EXP = NODE_ENV === 'development' ? '15d' : '15m';
export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET;