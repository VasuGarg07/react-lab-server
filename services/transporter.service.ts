import nodemailer, { TransportOptions } from 'nodemailer';
import { FROM_EMAIL, NODEMAILER_CONFIG } from '../configuration/app.config';

export const sendEmail = async (email: string, subject: string, html: string) => {
    try {
        const transporter = nodemailer.createTransport(NODEMAILER_CONFIG as TransportOptions);

        console.log(FROM_EMAIL, email, subject)
        await transporter.sendMail({
            from: FROM_EMAIL,
            to: email,
            subject: subject,
            html: html,
        });
        return { success: true }

    } catch (error) {
        return { success: false, error }
    }
};
