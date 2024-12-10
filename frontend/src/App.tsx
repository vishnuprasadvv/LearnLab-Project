import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
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
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";
import RegisterInstructor from "./pages/instructor/RegisterInstructor";
import { config } from "./config/config";
import ProfileSidebar from "./pages/students/ProfileSidebar";
import ProfileDashboard from "./components/user/profile/ProfileDashboard";
import ProfileCourses from "./components/user/profile/ProfileCourses";
import ProfileEdit from "./components/user/profile/ProfileEdit";
import ProfileChangePassword from "./components/user/profile/ProfileChangePassword";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import InstructorDashboardComponent from "./components/instructor/Dashboard";
import InstructorCourses from "./components/instructor/InstructorCourses";
import Messages from "./components/instructor/Messages";
import Notifications from "./components/instructor/Notifications";
import Navbar from "./components/common/Navbar/Navbar";
import AdminDashboardComponent from "./components/Admin/Dashboard";
import UserManagement from "./components/Admin/UserManagement";
import AddUser from "./components/Admin/AddUser";
import EditUser from "./components/Admin/EditUser";
import InstructorApplication from "./components/Admin/InstructorApplication";
import InstructorManagement from "./components/Admin/InstructorManagement";
import Categories from "./components/Admin/Categories";
import CreateCategory from "./pages/admin/Category/CreateCategory";
import EditCategory from "./pages/admin/Category/EditCategory";
import CourseMainCreation from "./pages/instructor/course/CourseMainCreation";
import LectureCreation from "./pages/instructor/course/LectureCreation";

const GOOGLE_CLIENT_ID = config.google.CLIENT_ID;

function App() {
  if (!GOOGLE_CLIENT_ID) {
    console.error("Google client id is not defined");
  }

  const Layout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation(); 
    const isAdminRoute = location.pathname.startsWith("/admin");
    return (
      <>
        {!isAdminRoute && <Navbar />}
        {children}
      </>
    );
  };
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        {/* <Navbar /> */}
        <Layout>

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
              <Route path="dashboard" element={<InstructorDashboardComponent />} />
              <Route path="courses" element={<InstructorCourses />} />
              <Route path="messages" element={<Messages />} />
              <Route path="notifications" element={<Notifications />} />


              <Route path="courses/create" element={<CourseMainCreation />} />
              <Route path="courses/create/:courseId/lecture" element={<LectureCreation />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<AdminProtectedRoute requiredRole="admin" />}>
            <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<AdminDashboardComponent />} />
            <Route path="dashboard" element={<AdminDashboardComponent />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="users/create" element={<AddUser />} />
            <Route path="users/edit/:id" element={<EditUser />} />
            <Route path="categories" element={<Categories />} />
            <Route path="categories/create" element={<CreateCategory />} />
            <Route path="categories/:id/edit" element={<EditCategory />} />
            <Route path="instructors" element={<InstructorManagement />} />
            <Route
              path="instructors/application/:id"
              element={<InstructorApplication />}
            />
            </Route>
          </Route>

          {/* Fallbacks */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Layout>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
