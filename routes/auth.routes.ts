import { Router } from "express";
import { verifyLoginRequest, verifySignupRequest, verifyToken } from "../middlewares/auth.middleware";
import { loginUser, registerUser, resendToken, verifyEmailToken } from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/register", verifySignupRequest, registerUser);
authRouter.post("/login", verifyLoginRequest, loginUser);

authRouter.post("/verify-token", verifyEmailToken);
authRouter.post("/resend-token", resendToken);

authRouter.post('/refresh-token', verifyToken);