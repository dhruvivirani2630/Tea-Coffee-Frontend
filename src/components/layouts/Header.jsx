import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  return (
    <header className="topbar">
      <Link to="/dashboard" className="brand">
        AccessDesk
      </Link>
      <div className="topbar-actions">
        <span>{user?.fullName}</span>
        <button type="button" className="button secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
