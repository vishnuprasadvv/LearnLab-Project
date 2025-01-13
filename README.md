# LearnLab LMS (Learning Management System)

Welcome to *LearnLab LMS*, a full-stack Learning Management System designed to offer a seamless experience for educators and learners. This application provides robust course management, secure user authentication, real-time communication, and a fully integrated payment system.

---

## Features

### User Features
- *User Authentication*:
  - Secure login and registration using Google OAuth2.
  - JWT-based session management for secure and seamless access.
- *Course Management*:
  - Browse, view, and enroll in available courses.
  - *Cart & Payment*:
  - Add courses to the cart and securely check out using PayPal integration.
- *Real-Time Chat*:
  - Interactive discussions with peers and educators powered by Socket.io.
- *Progress Tracking*:
  - View enrolled courses and track learning progress.
- *Dark/Light mode*:
  -System theme based and manual dark/light mode.

### Admin Features
- *Dashboard*:
  - Manage users, courses, and notifications efficiently.
- *Course Management*:
  - Add, edit, or delete courses.
- *User Management*:
  - Monitor and manage user activity.

---

## Technologies Used

### Frontend
- *Core Frameworks*: React.js, Redux Toolkit
- *Styling*: Tailwind CSS, Radix UI, Shadcn, DaisyUI
- *Validation*: React Hook Form, Zod
- *Media & Charts*: React Player, ChartJs
- *State Management*: Redux Persist
- *Real-Time Communication*: Socket.io-client
- *Payment Integration*: Stripe 

### Backend
- *Framework*: Node.js with Express.js
- *Database*: MongoDB with Mongoose
- *Authentication*: Google OAuth2, JWT
- *File Storage*: Cloudinary
- *Security*: Bcrypt for password hashing
- *Email Services*: Nodemailer

### Development Tools
- *Languages*: TypeScript
- *Linters & Formatters*: ESLint, Prettier
- *Runtime Tools*: Nodemon, ts-node-dev

---

## Setup & Installation

1. *Clone the repository:*
   
   bash
   git clone https://github.com/vishnuprasadvv/LearnLab-Project.git
   cd LearnLab-Project

2. **Install Dependencies:**
   - **For the backend**

     bash
     cd backend
     npm install
     
   - *For the frontend*

     bash
     cd frontend
     npm install

3. **Set up Environment Variables:**
  - Create a .env file in the server directory with the following variables:
    *backend*
    PORT=<server_port>
    CLIENT_URL=<client_url>
    MONGO_URI=<mongo_connection_string>
    JWT_ACCESS_TOKEN_SECRET=<your_jwt_secret>
    REFRESH_TOKEN_SECRET=<your_jwt_refresh_secret>
    EMAIL_PASS=<your_googleapppasskey>
    EMAIL_USER=<your_email>
    ACCESS_TOKEN_EXPIRE=<expire_time_in_minutes>
    REFRESH_TOKEN_EXPIRE=<expire_time_in_days>
    GOOGLE_CLIENT_ID=<your_google_auth_clientId>
    GOOGLE_CLIENT_SECRET=<your_google_auth_secret>
    GOOGLE_CALLBACK_URL=<your_google_auth_callbackurl>
    SESSION_SECRET=<session_secret>
    CLOUDINARY_CLOUD_NAME=<cloudinary_name>
    CLOUDINARY_API_KEY=<cloudinary_api_key>
    CLOUDINARY_API_SECRET=<cloudinary_api_secret>
    STRIPE_PUBLISHABLE_KEY=<stripe_publishable_key>
    STRIPE_SECRET_KEY=<stripe_client_secret>
    STRIPE_WEBHOOK_SECRET=<stripe_webhook_secret>

    *frontend*
    VITE_API_URL=<server_url>
    VITE_GOOGLE_CLIENT_ID=<google_client_id>
    VITE_STRIPE_PUBLISHABLE_KEY=<stripe_publishable_key>


4. *Run the application:*
   - *Start the backend server*

     bash
     cd backend
     npm run dev
     
   - **Start the frontend development server**

     bash
     cd frontend
     npm run dev

5. *Access the Application*

   - Open your browser and visit: http://localhost:<frontend_port>

## Contact

For any queries or suggestions, feel free to reach out:
- Author: Vishnu Prasad V V
- Email: vishnuprasadvv24@gmail.com
