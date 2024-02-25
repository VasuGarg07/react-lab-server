import mongoose from "mongoose";
import { IUser } from "../interfaces/user.interface";
import { object, string, ref } from "yup";

const userSchema = new mongoose.Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    avatar: { type: String, default: 'default_avatar_url_here' },
    verificationToken: { type: Number, default: null },
});

export const User = mongoose.model<IUser>("User", userSchema);

const getCharacterValidationError = (str: string) => {
    return `Your password must have at least 1 ${str}.`;
};

export const signupValidation = object({
    username: string()
        .required('Username is a required field')
        .min(3, 'Username must be at least 3 characters long')
        .max(30, "Username can't be greater than 30 characters"),
    email: string()
        .email('Must be a valid email')
        .required('Email is a required field'),
    password: string()
        .required('Password is a required field')
        .matches(/[A-Z]/, getCharacterValidationError('uppercase character'))
        .matches(/[a-z]/, getCharacterValidationError('lowercase character'))
        .matches(/[0-9]/, getCharacterValidationError('digit'))
        .matches(/[\^$*.[\]{}()?“!@#%&/,><’:;|_~`]/, getCharacterValidationError('special character'))
        .min(8, 'Password must contain at least 8 characters')
        .max(20, "Password can't be greater than 20 characters"),
    confirmPassword: string()
        .required('Confirm Password is a required field')
        .oneOf([ref('password')], 'Passwords must match')
});


export const loginValidation = object({
    email: string().email().required(),
    password: string()
        .required("password is a required field")
        .matches(/[A-Z]/, getCharacterValidationError("uppercase character"))
        .matches(/[a-z]/, getCharacterValidationError("lowercase character"))
        .matches(/[0-9]/, getCharacterValidationError("digit"))
        .matches(/[\^$*.[\]{}()?“!@#%&/,><’:;|_~`]/, getCharacterValidationError('special character'))
        .min(8, "Password must contain atleast 8 characters")
        .max(20, "Password can't be greater than 20 characters"),
});

