import { useEffect } from "react";
import Loader from "../../components/common/Loader";
import { ROLES, STATUS } from "../../constants/roles";
import { fetchUsers } from "../../store/slices/usersSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.items);
  const totalUsers = useAppSelector((state) => state.users.total);
  const loading = useAppSelector((state) => state.users.status === "loading");

  useEffect(() => {
    dispatch(fetchUsers({ page: 1, limit: 1000 }));
  }, [dispatch]);

  if (loading) return <Loader label="Loading admin dashboard" />;

  const active = users.filter((user) => user.status === STATUS.ACTIVE).length;
  const admins = users.filter((user) => user.role === ROLES.ADMIN).length;

  return (
    <section>
      <div className="page-title">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Monitor users, roles, and account status.</p>
        </div>
      </div>
      <div className="stats-grid">
        <article className="stat">
          <span>Total Users</span>
          <strong>{totalUsers || users.length}</strong>
        </article>
        <article className="stat">
          <span>Active Accounts</span>
          <strong>{active}</strong>
        </article>
        <article className="stat">
          <span>Admin Accounts</span>
          <strong>{admins}</strong>
        </article>
      </div>
    </section>
  );
};

export default AdminDashboard;
