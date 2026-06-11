import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "./Loader";
import { useAppSelector } from "../../store/hooks";

const ProtectedRoute = () => {
  const { user, bootstrapped } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!bootstrapped) return <Loader label="Checking session" />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
};

export default ProtectedRoute;
