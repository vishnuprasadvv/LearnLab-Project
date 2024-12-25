

export const config = {
    app: {
      PORT: import.meta.env.VITE_API_URL ||  'http://localhost:5000/api',
      //environment: process.env.NODE_ENV || 'development',
      BASE_URL : import.meta.env.VITE_BASE_URL ||  'http://localhost:5000',
    },
    google: {
      CLIENT_ID : import.meta.env.VITE_GOOGLE_CLIENT_ID 
    },
    stripe:{
      STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    }
}