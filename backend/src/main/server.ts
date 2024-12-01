import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from '../infrastructure/repositories/dbConnection';
import authRoutes from '../interfaces/routes/authRoutes'
import bodyParser from 'body-parser'
import { errorMiddleWare } from '../interfaces/middlewares/errorMiddleWare';
import protectedRoutes from '../interfaces/routes/protectedRoutes';
import adminRouter from '../interfaces/routes/adminRoutes';
import session from 'express-session';
import { config } from '../config/config';



const app = express();
app.use(express.json());

dotenv.config();

//cookie parser 
app.use(cookieParser());

//CORS setup 
app.use(cors({
    origin:process.env.CLIENT_URL,
    allowedHeaders:['Content-Type', 'Authorization'],
    methods:["GET", "POST", "DELETE", "PUT","PATCH"],
    credentials: true
}));

//bodyparser for cloudinary

// app.use(express.json({limit : "50mb"}))

app.use(bodyParser.urlencoded({
    extended: true
  }));


//middleware for sessions
app.use(
    session({
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: process.env.NODE_ENV === 'production' }
    })
);




//api test
app.get('/', (req: Request , res:Response, next : NextFunction) => {
    res.status(200).json({
        success :true,
        message : 'API is working'
    })
})
//authroutes 
app.use('/api/auth', authRoutes)
app.use('/api/protected', protectedRoutes)
app.use('/api/admin', adminRouter)

//unknown routes 
app.all('*', (req: Request, res: Response, next : NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err)
})


//error middleware (this must be last middleware)
app.use(errorMiddleWare)

//create server 
app.listen(config.app.PORT, () => {
    console.log(`server is running on port : http://localhost:${process.env.PORT}'`)
    connectDB();
});  