import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./pages/students/Login";
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
import { Toaster } from "react-hot-toast";
import RegisterInstructor from "./pages/instructor/RegisterInstructor";
import { AdminInstructors } from "./pages/admin/AdminInstructors";
import { AdminInstructorApplication } from "./pages/admin/AdminInstructorApplication";
import { config } from "./config/config";
import ProfileSidebar from "./pages/students/ProfileSidebar";
import ProfileDashboard from "./components/user/profile/ProfileDashboard";
import ProfileCourses from "./components/user/profile/ProfileCourses";
import ProfileEdit from "./components/user/profile/ProfileEdit";
import ProfileChangePassword from "./components/user/profile/ProfileChangePassword";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import Dashboard from "./components/instructor/Dashboard";
import InstructorCourses from "./components/instructor/InstructorCourses";
import Messages from "./components/instructor/Messages";
import Notifications from "./components/instructor/Notifications";
import Navbar from "./components/common/Navbar/Navbar";
const GOOGLE_CLIENT_ID = config.google.CLIENT_ID;

function App() {
  if (!GOOGLE_CLIENT_ID) {
    console.error("Google client id is not defined");
  }
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        {/* <Navbar /> */}
        <Navbar />
        <Toaster />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/verify-account" element={<VerifyAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />

            {/* Profile */}
            <Route path="/profile" element={<ProfileSidebar />}>
              <Route index element={<ProfileDashboard />} />
              <Route path="dashboard" element={<ProfileDashboard />} />
              <Route path="courses" element={<ProfileCourses />} />
              <Route path="edit" element={<ProfileEdit />} />
              <Route
                path="change-password"
                element={<ProfileChangePassword />}
              />
            </Route>

            {/* Instructor registration */}
            <Route
              path="/instructor/register"
              element={<RegisterInstructor />}
            />
          </Route>

          {/* Instructor routes */}
          <Route element={<ProtectedRoute requiredRole="instructor" />}>
            <Route path="/instructor" element={<InstructorDashboard />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="courses" element={<InstructorCourses />} />
              <Route path="messages" element={<Messages />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<AdminProtectedRoute requiredRole="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/create" element={<AdminAddUser />} />
            <Route path="/admin/users/edit/:id" element={<AdminEditUser />} />
            <Route path="/admin/instructors" element={<AdminInstructors />} />
            <Route
              path="/admin/instructors/application/:id"
              element={<AdminInstructorApplication />}
            />
          </Route>

          {/* Fallbacks */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
