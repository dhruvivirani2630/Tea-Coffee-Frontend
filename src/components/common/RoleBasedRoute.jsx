import { Navigate, Outlet } from "react-router-dom";
import Loader from "./Loader";
import { useAppSelector } from "../../store/hooks";

const RoleBasedRoute = ({ roles }) => {
  const { user, bootstrapped } = useAppSelector((state) => state.auth);

  if (!bootstrapped) return <Loader label="Checking permissions" />;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

export default RoleBasedRoute;
