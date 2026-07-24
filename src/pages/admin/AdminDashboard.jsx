import { useEffect } from "react";
import Loader from "../../components/common/Loader";
import OrderStatistics from "../../components/common/OrderStatistics";
import { ROLES, STATUS } from "../../constants/roles";
import { fetchUsers } from "../../store/slices/usersSlice";
import { fetchOrders } from "../../store/slices/ordersSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.items);
  const totalUsers = useAppSelector((state) => state.users.total);
  const usersLoading = useAppSelector((state) => state.users.status === "loading");
  const orders = useAppSelector((state) => state.orders.items);
  const ordersLoading = useAppSelector((state) => state.orders.status === "loading");

  useEffect(() => {
    if (!users.length) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  useEffect(() => {
    if (!orders.length) {
      dispatch(fetchOrders({ user: null, isAdmin: true }));
    }
  }, [dispatch, orders.length]);

  if (usersLoading || ordersLoading) return <Loader label="Loading admin dashboard" />;

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

      <OrderStatistics orders={orders} title="All Users Tea & Coffee Orders" />
    </section>
  );
};

export default AdminDashboard;
