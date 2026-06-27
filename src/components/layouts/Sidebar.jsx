import { NavLink } from "react-router-dom";
import { isAdminRole } from "../../constants/roles";
import { useAppSelector } from "../../store/hooks";

const Sidebar = () => {
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = isAdminRole(user?.role);

  return (
    <aside className="sidebar">
      <nav>
        {isAdmin ? (
          <>
            <NavLink to="/admin" end>
              Admin Dashboard
            </NavLink>
            <NavLink to="/admin/users">User Management</NavLink>
          </>
        ) : (
          <NavLink to="/dashboard" end>
            Dashboard
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
