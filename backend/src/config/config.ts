export const config = {
    app:{
        ENVIRONMENT : process.env.NODE_ENV || 'development',
        PORT : process.env.PORT || '5000',
        CLIENT_URL : process.env.CLIENT_URL || "http://localhost:5173"
    },
    
}