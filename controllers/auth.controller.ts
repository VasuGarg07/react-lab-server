import { ILoginResponse } from "../interfaces/user.interface";
import { VerificationEmailSent } from "../messages/user.messages";
import { getUser, refreshAccessToken, resendVerificationToken, signupUser, verifyEmail } from "../services/auth.service";
import { sendEmail } from "../services/transporter.service";
import { TokenVerifictionError } from "../utils/utilities";
import { verifyEmailBody, verifyEmailSubject } from "../utils/email-templates";
import { Request, Response } from "express";

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, username, verificationToken } = await signupUser(req.body);
        await sendEmail(email, verifyEmailSubject, verifyEmailBody(verificationToken, username));
        res.status(201).json({ message: VerificationEmailSent });
    } catch (error) {
        console.log(error)
        res.status(400).json({ error });
    }
}

export const verifyEmailToken = async (req: Request, res: Response) => {
    try {
        const response = await verifyEmail(req.body.token);
        res.status(200).json({ message: response });
    } catch (error) {
        const err = error as TokenVerifictionError;
        res.status(400).json({ message: err.message, errorCode: err.errorCode });
    }
};

export const resendToken = async (req: Request, res: Response) => {

    try {
        const { verificationToken, email, username } = await resendVerificationToken(req.body.token);
        await sendEmail(email, verifyEmailSubject, verifyEmailBody(verificationToken, username));
        res.status(201).json({ message: VerificationEmailSent });

    } catch (error) {
        const err = error as TokenVerifictionError;
        res.status(400).json({ message: err.message, errorCode: err.errorCode });
    }
};

export const loginUser = async (req: Request, res: Response) => {

    try {
        const response: ILoginResponse = await getUser(req.body);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error });
    }
}

export const refreshToken = async (req: Request, res: Response) => {
    const token = req.headers["authorization"]!.split(" ")[1];
    try {
        const response = refreshAccessToken(token);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error });
    }
}