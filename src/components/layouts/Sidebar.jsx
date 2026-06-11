import { NavLink } from "react-router-dom";
import { ROLES } from "../../constants/roles";
import { useAppSelector } from "../../store/hooks";

const Sidebar = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <aside className="sidebar">
      <nav>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <NavLink to="/profile/edit">Edit Profile</NavLink>
        {user?.role === ROLES.ADMIN && (
          <>
            <NavLink to="/admin">Admin Dashboard</NavLink>
            <NavLink to="/admin/users">User Management</NavLink>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
