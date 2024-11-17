import { Request, Response, NextFunction } from "express";

export const studentHome = (req: Request, res: Response) => {
    res.json({'message' : 'welcome user'})
}