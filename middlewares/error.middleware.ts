import { NextFunction, Request, Response } from "express";

export const error404 = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.originalUrl)
    const error = new Error('Not Found');
    res.status(404).json({ error: 'Not Found' });
    next(error);
}