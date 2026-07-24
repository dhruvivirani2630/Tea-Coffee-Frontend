import { useEffect, useMemo } from "react";
import { formatDate } from "../../utils/date";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchOrders } from "../../store/slices/ordersSlice";
import { getUserOrders } from "../../utils/orderFilters";
import OrderStatistics from "../../components/common/OrderStatistics";

const UserDashboard = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const orders = useAppSelector((state) => state.orders.items);
  const ordersLoading = useAppSelector((state) => state.orders.status === "loading");

  useEffect(() => {
    // Fetch orders when user is logged in
    if (user && user.id) {
      dispatch(fetchOrders({ user, isAdmin: false }));
    }
  }, [dispatch, user?.id]);

  const userOrders = useMemo(() => {
    return getUserOrders(orders, user);
  }, [orders, user]);

  return (
    <section>
      <div className="page-title">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.fullName || "User"}.</p>
        </div>
      </div>
      <div className="stats-grid">
        <article className="stat">
          <span>Role</span>
          <strong>{user?.role || "-"}</strong>
        </article>
        <article className="stat">
          <span>Status</span>
          <strong>{user?.status || "-"}</strong>
        </article>
        <article className="stat">
          <span>Registered</span>
          <strong>{user?.createdDate ? formatDate(user.createdDate) : "-"}</strong>
        </article>
      </div>

      {ordersLoading ? (
        <div style={{ marginTop: "2rem" }}>
          <p>Loading your orders...</p>
        </div>
      ) : (
        <OrderStatistics orders={userOrders} title="Your Tea & Coffee Orders" />
      )}
    </section>
  );
};

export default UserDashboard;
