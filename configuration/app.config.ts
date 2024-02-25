import dotenv from "dotenv";
dotenv.config();

export const PROD = false;

export const SERVER_PORT = process.env.SERVER_PORT || 3000;
export const BASE_URL = PROD ? process.env.FE_URL : "http://localhost:5173/";
export const MONGO_URI = process.env.MONGODB_URI!;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const AES_KEY = process.env.AES_KEY!;

// To use nodemailer service I have used ethereal (https://ethereal.email/) for testing
export const NODEMAILER_CONFIG = {
    host: PROD ? process.env.NODEMAILER_PROD_HOST! : process.env.NODEMAILER_HOST!,
    port: PROD ? process.env.NODEMAILER_PROD_PORT! : process.env.NODEMAILER_PORT!,
    auth: {
        user: PROD ? process.env.NODEMAILER_PROD_USER! : process.env.NODEMAILER_USER!,
        pass: PROD ? process.env.NODEMAILER_PROD_PASS! : process.env.NODEMAILER_PASS!,
    },
};

export const FROM_EMAIL = PROD ? process.env.NODEMAILER_PROD_USER! : process.env.NODEMAILER_USER!;