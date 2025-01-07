import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./pages/students/Login";
import Home from "./pages/students/Home";
import Signup from "./pages/students/Signup";
import VerifyAccount from "./pages/VerifyAccount";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Unauthorized from "./pages/Unauthorized";
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
import ProfileCourses from "./pages/students/profile/ProfileCourses";
import ProfileEdit from "./components/user/profile/ProfileEdit";
import ProfileChangePassword from "./components/user/profile/ProfileChangePassword";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import InstructorDashboardComponent from "./pages/instructor/dashboard/Dashboard";
import InstructorCourses from "./pages/instructor/InstructorCourses";
import Navbar from "./components/common/Navbar/Navbar";
import AdminDashboardComponent from "./pages/admin/dashboard/Dashboard";
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
import CourseOverview from "./pages/instructor/course/CourseOverview";
import CourseMainEdit from "./pages/instructor/course/CourseMainEdit";
import LectureEdit from "./pages/instructor/course/LectureEdit";
import CoursesPage from "./pages/students/coursesPage/CoursesPage";
import CourseDetails from "./pages/students/courseDetails/CourseDetails";
import AdminCourseManagement from "./pages/admin/courses/CourseManagement";
import CourseOverviewAdmin from "./pages/admin/courses/CourseOverview";
import PurchaseCancel from "./pages/students/purchase/PurchaseCancel";
import PurchaseSuccess from "./pages/students/purchase/PurchaseSuccess";
import LectureView from "./pages/students/courseDetails/LectureView";
import AdminPurchases from "./pages/admin/purchases/AdminPurchases";
import InstructorPurchases from "./pages/instructor/purchases/InstructorPurchases";
import ChatMain from "./pages/students/chat/ChatMain";
import Wishlist from "./pages/students/wishlist/Wishlist";
import Footer from "./components/common/Footer/Footer";

const GOOGLE_CLIENT_ID = config.google.CLIENT_ID;

function App() {
  if (!GOOGLE_CLIENT_ID) {
    console.error("Google client id is not defined");
  }

  const Layout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith("/admin");
    const isInstructorRoute = location.pathname.startsWith("/instructor")
    return (
      <>
        {!isAdminRoute && <Navbar />}
        {children}
        { !isAdminRoute &&  !isInstructorRoute && <Footer />}
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
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/verify-account" element={<VerifyAccount />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route
              path="/courses/course-details/:id"
              element={<CourseDetails />}
            />
            <Route
              path="/courses/course-details/:id/lectures"
              element={<LectureView />}
            />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
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

              <Route path="/cancel" element={<PurchaseCancel />} />
              <Route path="/payment/success" element={<PurchaseSuccess />} />
              <Route path="/chat" element={<ChatMain />} />
              <Route path="/wishlist" element={<Wishlist />} />

              {/* Instructor registration */}
              <Route
                path="/instructor/register"
                element={<RegisterInstructor />}
              />
            </Route>

            {/* Instructor routes */}
            <Route element={<ProtectedRoute requiredRole="instructor" />}>
              <Route path="/instructor" element={<InstructorDashboard />}>
                <Route
                  path="dashboard"
                  element={<InstructorDashboardComponent />}
                />
                <Route path="courses" element={<InstructorCourses />} />
                <Route path="courses/create" element={<CourseMainCreation />} />
                <Route
                  path="courses/create/:courseId/lecture"
                  element={<LectureCreation />}
                />
                <Route
                  path="courses/create/:courseId/lecture/overview"
                  element={<CourseOverview />}
                />
                <Route
                  path="courses/:courseId/overview"
                  element={<CourseOverview />}
                />
                <Route
                  path="courses/:courseId/edit"
                  element={<CourseMainEdit />}
                />
                <Route
                  path="courses/:courseId/edit/lecture"
                  element={<LectureEdit />}
                />
                <Route
                  path="purchases"
                  element={<InstructorPurchases />}
                />
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
                <Route path="courses" element={<AdminCourseManagement />} />
                <Route path="purchases" element={<AdminPurchases />} />
                <Route
                  path="courses/:courseId/overview"
                  element={<CourseOverviewAdmin />}
                />
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
