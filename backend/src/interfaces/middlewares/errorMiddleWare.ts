import { Request, Response, NextFunction } from "express";

class CustomError extends Error{
    statusCode : number;
    constructor(message : string, statusCode : number = 500){
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor)
    }
}

//middleware handler

const errorMiddleWare = (
    err: Error | CustomError,
    req : Request,
    res : Response,
    next : NextFunction
) => {
    console.error(`[ERROR] ${err.message}`)

    const statusCode = (err as CustomError).statusCode || 500;
    const message  = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success : false,
        message
    })
}

export {CustomError, errorMiddleWare};