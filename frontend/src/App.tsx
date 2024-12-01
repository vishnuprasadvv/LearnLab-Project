import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from "./pages/students/Login";
import Navbar from "./pages/NavBar";
import Home from "./pages/students/Home";
import Signup from "./pages/students/Signup";
import VerifyAccount from "./pages/VerifyAccount";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Unauthorized from "./pages/Unauthorized";
import LandingPage from "./pages/LandingPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import ForgotPassword from "./pages/students/ForgotPassword";
import ResetPassword from "./pages/students/ResetPassword";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAddUser from "./pages/admin/AdminAddUser";
import AdminEditUser from "./pages/admin/AdminEditUser";
import NotFound from "./pages/NotFound";
import Profile from "./pages/students/Profile";
import { Toaster } from "react-hot-toast";
import RegisterInstructor from "./pages/instructor/RegisterInstructor";
import { AdminInstructors } from "./pages/admin/AdminInstructors";
import { AdminInstructorApplication } from "./pages/admin/AdminInstructorApplication";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID


function App() {
  return (

    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Navbar />
        <Toaster />

        <Routes>
          <Route path="/" element={< LandingPage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/verify-account" element={<VerifyAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/home"

            element={
              <ProtectedRoute>
                < Home />
              </ProtectedRoute>
            } />

          <Route path="/profile"

            element={
              <ProtectedRoute>
                < Profile />
              </ProtectedRoute>
            } />


          <Route path="/admin/dashboard" element={
            <AdminProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </AdminProtectedRoute>
          } />

          <Route path="/admin/users" element={
            <AdminProtectedRoute requiredRole="admin">
              <AdminUsers />
            </AdminProtectedRoute>
          } />

          <Route path="/admin/users/create" element={
            <AdminProtectedRoute requiredRole="admin">
              <AdminAddUser />
            </AdminProtectedRoute>
          } />

          <Route path="/admin/users/edit/:id" element={
            <AdminProtectedRoute requiredRole="admin">
              <AdminEditUser />
            </AdminProtectedRoute>
          } />

          <Route path="/admin/instructors" element={
            <AdminProtectedRoute requiredRole="admin">
              <AdminInstructors />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/instructors/application/:id" element={
            <AdminProtectedRoute requiredRole="admin">
              <AdminInstructorApplication />
            </AdminProtectedRoute>
          } />

          {/* instructor routes */}
          <Route path="/instructor/register"
            element={
              <ProtectedRoute>
                < RegisterInstructor />
              </ProtectedRoute>
            } />


          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

      </Router>
    </GoogleOAuthProvider>
  )
}


export default App;