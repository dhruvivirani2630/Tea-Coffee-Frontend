import { Navigate, Outlet } from "react-router-dom";
import Loader from "./Loader";
import { ROLES, isAdminRole } from "../../constants/roles";
import { useAppSelector } from "../../store/hooks";

const RoleBasedRoute = ({ roles }) => {
  const { user, bootstrapped } = useAppSelector((state) => state.auth);

  if (!bootstrapped) return <Loader label="Checking permissions" />;
  if (!user) return <Navigate to="/login" replace />;

  const hasAccess = roles.some((role) => {
    if (role === ROLES.ADMIN) return isAdminRole(user.role);
    if (role === ROLES.USER) return !isAdminRole(user.role);
    return user.role === role;
  });

  if (!hasAccess) {
    return <Navigate to={isAdminRole(user.role) ? "/admin" : "/dashboard"} replace />;
  }
  return <Outlet />;
};

export default RoleBasedRoute;
