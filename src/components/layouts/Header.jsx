import { Link, useNavigate } from "react-router-dom";
import { isAdminRole } from "../../constants/roles";
import { logoutUser } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = isAdminRole(user?.role);
  const homePath = isAdmin ? "/admin" : "/dashboard";

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  return (
    <header className="topbar">
      <Link to={homePath} className="brand">
        AccessDesk
      </Link>
      <div className="topbar-actions">
        <span>{user?.fullName}</span>
        <Link to="/profile/edit" className="button secondary">
          Edit Profile
        </Link>
        <button type="button" className="button secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
