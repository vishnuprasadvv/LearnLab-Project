import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from '../infrastructure/repositories/dbConnection';
import authRoutes from '../interfaces/routes/authRoutes'
import bodyParser from 'body-parser'
import { errorMiddleWare } from '../interfaces/middlewares/errorMiddleWare';
import studentRoutes from '../interfaces/routes/studentRoutes';
import adminRouter from '../interfaces/routes/adminRoutes';
import session from 'express-session';
import { config } from '../infrastructure/config/config';
import instructorRouter from '../interfaces/routes/instructorRoutes';
import webhookRouter from '../interfaces/routes/webhookRoute'

import { createServer } from 'http';
import { Server } from 'socket.io';
import chatRouter from '../interfaces/routes/chatRoutes';

const PORT = config.app.PORT
const app = express();

//create an HTTP server for socket 
const server = createServer(app);
//initialize socket.io
export const io = new Server(server, {
    cors: {
        origin: config.cors.CLIENT_URL,
        methods: config.cors.ALLOWED_METHODS,
        credentials: config.cors.CREDENTIALS
    },
})


const onlineUsers = new Map<string, string>();

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    //handle custom events 
    socket.on('message', (data) => {
        console.log('message received', data);
        io.emit('message', data)
    })

    //handle incoming messges from users 
    socket.on('sendMessage', (data) => {
        //broadcast message to the same chat room
        console.log('sendmessage', data)
        io.to(data.chatId).emit('newMessage', data)
    })
    //handle diconnections
    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id)
        onlineUsers.delete(socket.id);
        io.emit('updateUserStatus',  Array.from(onlineUsers.values()));
    })

    //handle user login and save the user as online 
    socket.on('setUserOnline', (userId: string) => {
        onlineUsers.set(socket.id, userId);
        io.emit('updateUserStatus', Array.from(onlineUsers.values()));
        console.log(`User ${userId} is online`)
    })

    socket.on('setUserOffline', (userId: string) => {
        onlineUsers.delete(socket.id)
        io.emit('updateUserStatus', Array.from(onlineUsers.values()))
        console.log(`User ${userId} is offline`)
    })

    //join the socket to a specific room chat
    socket.on('joinChat', (chatId) => {
        socket.join(chatId); //join the room with the provided chatId
        console.log(`User ${socket.id} joined chat ${chatId}`)
    })
})

app.use('/api',webhookRouter)
app.use(express.json());
dotenv.config();
//cookie parser 
app.use(cookieParser());

//CORS setup 
app.use(cors({
    origin : config.cors.CLIENT_URL,
    allowedHeaders : config.cors.ALLOWED_HEADERS,
    methods : config.cors.ALLOWED_METHODS,
    credentials : config.cors.CREDENTIALS
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
app.use('/api/student', studentRoutes)
app.use('/api/admin', adminRouter)
app.use('/api/instructor', instructorRouter)
app.use('/api/chat', chatRouter)

//unknown routes 
app.all('*', (req: Request, res: Response, next : NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err)
})


//error middleware (this must be last middleware)
app.use(errorMiddleWare)

//create server 
server.listen(PORT, () => {
    console.log(`server is running on port : http://localhost:${PORT}'`)
    connectDB();
});  