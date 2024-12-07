import dotenv from 'dotenv'
dotenv.config()

export interface AppConfig {
    ENVIRONMENT : string;
    PORT : string | number;
}

export interface CorsConfig {
    CLIENT_URL : string;
    ALLOWED_HEADERS : string[];
    ALLOWED_METHODS : string[];
    CREDENTIALS : boolean
}

export interface MongoDBConfig {
    URI: string | undefined;
}

export interface JwtConfig {
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRE?: string;
    REFRESH_TOKEN_EXPIRE?: string;
}

export interface GoogleConfig {
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    GOOGLE_CALLBACK_URL?: string;
}

export interface EmailConfig {
    EMAIL_USER?: string;
    EMAIL_PASS?: string;
}

export interface SessionConfig {
    SESSION_SECRET?: string;
}

export interface CloudinaryConfig {
    CLOUD_NAME?: string,
    API_KEY?: string,
    API_SECRET?: string
}

export interface Config {
    app: AppConfig;
    cors: CorsConfig;
    mongoDB: MongoDBConfig;
    jwt: JwtConfig;
    google: GoogleConfig;
    email: EmailConfig;
    session: SessionConfig;
    cloudinary : CloudinaryConfig
}


export const config : Config = {
    app: {
        ENVIRONMENT: process.env.NODE_ENV || 'development',
        PORT: process.env.PORT || '5000',

    },
    cors: {
        CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
        ALLOWED_HEADERS : ['Content-Type', 'Authorization'],
        ALLOWED_METHODS : ["GET", "POST", "DELETE", "PUT","PATCH"],
        CREDENTIALS : true,
    },

    mongoDB: {
        URI : process.env.MONGO_URI 
    },

    jwt: {
        ACCESS_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET || 'access secret',
        REFRESH_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET || 'refresh secret',
        ACCESS_TOKEN_EXPIRE : process.env.ACCESS_TOKEN_EXPIRE,
        REFRESH_TOKEN_EXPIRE : process.env.REFRESH_TOKEN_EXPIRE,
    },
    google: {
        GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET : process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_CALLBACK_URL : process.env.GOOGLE_CALLBACK_URL
    },
    email: {
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASS : process.env.EMAIL_PASS
    },

    session: {
        SESSION_SECRET : process.env.SESSION_SECRET
    },

    cloudinary:{
        CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        API_KEY : process.env.CLOUDINARY_API_KEY,
        API_SECRET : process.env.CLOUDINARY_API_SECRET
    }
}