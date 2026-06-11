import { Link } from "react-router-dom";
import { formatDate } from "../../utils/date";
import { useAppSelector } from "../../store/hooks";

const UserDashboard = () => {
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === "Admin";

  return (
    <section>
      <div className="page-title">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {user.fullName}.</p>
        </div>
        {isAdmin && <Link className="button primary" to="/admin">Open admin</Link>}
      </div>
      <div className="stats-grid">
        <article className="stat">
          <span>Role</span>
          <strong>{user.role}</strong>
        </article>
        <article className="stat">
          <span>Status</span>
          <strong>{user.status}</strong>
        </article>
        <article className="stat">
          <span>Registered</span>
          <strong>{formatDate(user.createdDate)}</strong>
        </article>
      </div>
    </section>
  );
};

export default UserDashboard;
