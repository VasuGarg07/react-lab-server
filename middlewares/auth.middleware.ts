import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ValidationError } from "yup";
import { JWT_SECRET } from "../configuration/app.config";
import { loginValidation } from "../models/user.model";

export const verifySignupRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await loginValidation.validate(req.body);
    return next();
  } catch (error: any) {
    let knownError = error as ValidationError;
    console.log(knownError)
    return res.status(400).json({ error: knownError.errors[0] });
  }
};

export const verifyLoginRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await loginValidation.validate(req.body);
    return next();
  } catch (error: any) {
    let knownError = error as ValidationError;
    return res.status(400).json({ error: knownError.errors[0] });
  }
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers["authorization"];
  const token = authorizationHeader && (authorizationHeader as string).split(" ")[1];

  if (!token) {
    return res.status(403).send("Token required for authentication");
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded Value: ", decoded);
    return next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};