import { ILoginRequest, ILoginResponse, ISignupRequest, ISignupResponse } from "../interfaces/user.interface";
import { AlreadyVerified, EmailVerified, InvalidLink, TokenExpired, UserNotExist, UserNotVerified, VerificationEmailAlreadySent } from "../messages/user.messages";
import { User } from "../models/user.model";
import { TokenVerifictionError } from "../utils/utilities";
import { TokenVerifictionErrorCodes } from "../utils/enums";
import { EncryptionUtils, JwtUtils } from "../utils/utilities";
import { JwtAccessTokenExpiry, JwtRefreshTokenExpiry, VerificationTokenValidity } from "../utils/constants";

export async function signupUser(userData: ISignupRequest): Promise<ISignupResponse> {

    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) throw 'User already exists with the given email or username.';
    const newUser = new User({
        username: userData.username,
        email: userData.email.toLowerCase(),
        password: EncryptionUtils.encryptData(userData.password),
        isEmailVerified: false,
        verificationToken: new Date().valueOf() + VerificationTokenValidity
    });
    await newUser.save();

    return {
        username: newUser.username,
        email: newUser.email.toLowerCase(),
        verificationToken:
            EncryptionUtils.encryptData(JSON.stringify({
                id: newUser._id.toString(),
                token: newUser.verificationToken
            }))
    };
}

export const verifyEmail = async (token: string) => {
    let currentTime = new Date().valueOf();
    const decryptedData = JSON.parse(EncryptionUtils.decryptData(token));

    let user = await User.findById(decryptedData.id);
    if (!user) throw InvalidLink;
    if (user.isEmailVerified) throw new TokenVerifictionError(AlreadyVerified, TokenVerifictionErrorCodes.AlreadyVerified);
    if (decryptedData.verificationToken < currentTime) throw new TokenVerifictionError(TokenExpired, TokenVerifictionErrorCodes.Expired);

    user = await User.findByIdAndUpdate(user._id,
        {
            isEmailVerified: true,
            verificationToken: null
        },
        { new: true }
    );

    return EmailVerified;
}

export const resendVerificationToken = async (token: string) => {
    let currentTime = new Date().valueOf();
    const decryptedData = JSON.parse(EncryptionUtils.decryptData(token));

    let user = await User.findById(decryptedData.id);
    if (!user) throw InvalidLink;
    if (user.isEmailVerified) throw new TokenVerifictionError(AlreadyVerified, TokenVerifictionErrorCodes.AlreadyVerified);
    if (decryptedData.verificationToken > currentTime) throw new TokenVerifictionError(VerificationEmailAlreadySent, TokenVerifictionErrorCodes.AnotherTokenSent);

    user = await User.findById(user._id,
        { token: currentTime + VerificationTokenValidity },
        { returnDocument: "after" }
    );

    return {
        email: user!.email,
        username: user!.username,
        verificationToken: EncryptionUtils.encryptData(JSON.stringify({
            id: user!._id.toString(),
            token: user!.verificationToken
        }))
    };
}

export const getUser = async (userData: ILoginRequest) => {

    const user = await User.findOne({ email: userData.email });
    if (!user || userData.password !== EncryptionUtils.decryptData(user.password)) throw UserNotExist;
    if (!user.isEmailVerified) throw UserNotVerified;

    const response: ILoginResponse = {
        accessToken: JwtUtils.generateJwtToken(user._id, JwtAccessTokenExpiry),
        refreshToken: JwtUtils.generateJwtToken(user._id, JwtRefreshTokenExpiry),
        username: user.username,
        avatar: user.avatar
    }

    return response;
};

export const refreshAccessToken = (token: string) => {
    const decoded = JwtUtils.decodeJwt(token);
    return {
        accessToken: JwtUtils.generateJwtToken(decoded.userId, JwtAccessTokenExpiry)
    }
}