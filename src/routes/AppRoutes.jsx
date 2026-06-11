import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";
import RoleBasedRoute from "../components/common/RoleBasedRoute";
import { ROLES } from "../constants/roles";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import EditUser from "../pages/admin/EditUser";
import UserDetails from "../pages/admin/UserDetails";
import UserManagement from "../pages/admin/UserManagement";
import EditProfilePage from "../pages/user/EditProfilePage";
import ProfilePage from "../pages/user/ProfilePage";
import UserDashboard from "../pages/user/UserDashboard";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />

    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />

        <Route element={<RoleBasedRoute roles={[ROLES.ADMIN]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/users/:id" element={<UserDetails />} />
          <Route path="/admin/users/:id/edit" element={<EditUser />} />
        </Route>
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default AppRoutes;
