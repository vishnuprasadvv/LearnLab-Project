import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from '../infrastructure/repositories/dbConnection';
import authRoutes from '../interfaces/routes/authRoutes'
import bodyParser from 'body-parser'
import { errorMiddleWare } from '../interfaces/middlewares/errorMiddleWare';


const app = express();
dotenv.config();

//bodyparser for cloudinary

// app.use(express.json({limit : "50mb"}))

app.use(express.json());

app.use(bodyParser.urlencoded({
    extended: true
  }));

//cookie parser 
app.use(cookieParser());




//CORS setup 
app.use(cors({
    origin:process.env.ORIGIN
}));


//api test
app.get('/', (req: Request , res:Response, next : NextFunction) => {
    res.status(200).json({
        success :true,
        message : 'API is working'
    })
})
//authroutes 
app.use('/api/auth', authRoutes)

//unknown routes 
app.all('*', (req: Request, res: Response, next : NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err)
})


//error middleware (this must be last middleware)
app.use(errorMiddleWare)

//create server 
app.listen(process.env.PORT || 5000 , () => {
    console.log(`server is running on port : http://localhost:${process.env.PORT}'`)
    connectDB();
});  