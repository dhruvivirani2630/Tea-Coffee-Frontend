import { Link } from "react-router-dom";
import { logoutUser } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const Header = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <header className="topbar">
      <Link to="/dashboard" className="brand">
        AccessDesk
      </Link>
      <div className="topbar-actions">
        <span>{user?.fullName}</span>
        <button type="button" className="button secondary" onClick={() => dispatch(logoutUser())}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
