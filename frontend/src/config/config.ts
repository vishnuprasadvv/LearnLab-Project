

export const config = {
    app: {
      PORT: import.meta.env.VITE_API_URL ||  'http://localhost:5000/api',
      //environment: process.env.NODE_ENV || 'development',
    },
    google: {
      CLIENT_ID : import.meta.env.VITE_GOOGLE_CLIENT_ID 
    }
}