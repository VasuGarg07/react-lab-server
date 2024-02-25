import { Types } from "mongoose";

export interface IUser {
    username: string;
    email: string;
    password: string;
    isEmailVerified: boolean;
    avatar: string;
    verificationToken?: number | null;
}

export interface ISignupRequest {
    username: string,
    email: string,
    password: string,
    confirmPassword: string
}

export interface ILoginRequest {
    email: string,
    password: string,
}

export interface ISignupResponse {
    username: string;
    email: string;
    verificationToken: string;
}

export interface ILoginResponse {
    username: string,
    avatar: string,
    accessToken: string,
    refreshToken: string
}