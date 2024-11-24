import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from "./pages/Login";
import Navbar from "./pages/NavBar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import VerifyAccount from "./pages/VerifyAccount";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminPage";
import Unauthorized from "./pages/Unauthorized";
import LandingPage from "./pages/LandingPage";
import AdminLogin from "./pages/AdminLogin";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import ForgotPassword from "./pages/students/ForgotPassword";
import ResetPassword from "./pages/students/ResetPassword";


function App() {
  return (

    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={< LandingPage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/verify-account" element={<VerifyAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/home"

            element={
              <ProtectedRoute>
                < Home />
              </ProtectedRoute>
            } />


          <Route path="/admin/dashboard" element={
            <AdminProtectedRoute requiredRole="admin">

              <AdminDashboard />
            </AdminProtectedRoute>
          } />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>

      </Router>
    </GoogleOAuthProvider>
  )
}


export default App;