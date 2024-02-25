import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { AES_KEY, JWT_SECRET } from '../configuration/app.config';

export const TokenValidity = 2 * 60 * 60 * 1000;

// JWT Utils
export namespace JwtUtils {

    export const generateJwtToken = (userId: Types.ObjectId, validity: string) => {
        return jwt.sign({ userId }, JWT_SECRET, { expiresIn: validity });
    }

    export const verifyJwtToken = (token: string) => {
        return jwt.verify(token, JWT_SECRET);
    }

    export const decodeJwt = (token: string): JwtPayload => {
        return jwt.decode(token) as JwtPayload
    }
}

// Encryption Utils
export namespace EncryptionUtils {

    export const encryptionType = "aes-256-cbc";

    const encryptionIV = createHash("sha512").digest("hex").substring(0, 16);

    export const generateAesKey = () => {
        const aesKey = randomBytes(16).toString("hex");
        return aesKey
    };

    export const encryptData = (data: string) => {
        const cipher = createCipheriv(encryptionType, AES_KEY, encryptionIV);
        return Buffer.from(cipher.update(data, "utf8", "hex") + cipher.final("hex")).toString("base64");
    };

    export const decryptData = (encryptedData: string) => {
        const buff = Buffer.from(encryptedData, "base64");
        const decipher = createDecipheriv(encryptionType, AES_KEY, encryptionIV);
        return decipher.update(buff.toString("utf8"), "hex", "utf8") + decipher.final("utf8");
    };
}