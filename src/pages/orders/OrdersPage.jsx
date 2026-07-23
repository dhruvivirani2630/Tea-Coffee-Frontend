import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createOrder, deleteOrder, fetchOrders, updateOrder } from "../../store/slices/ordersSlice";
import { isAdminRole } from "../../constants/roles";

const emptyForm = {
  employeeId: "",
  employeeName: "",
  drinkType: "Tea",
  quantity: 1,
  dateTime: "",
};

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const orders = useAppSelector((state) => state.orders.items);
  const loading = useAppSelector((state) => state.orders.status === "loading");
  const error = useAppSelector((state) => state.orders.error);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const isAdmin = isAdminRole(user?.role);

  useEffect(() => {
    dispatch(fetchOrders({ user, isAdmin }));
  }, [dispatch, user, isAdmin]);

//   const visibleOrders = useMemo(() => {
//     if (!isAdmin) {
//       const currentUserId = String(user?.id || user?.employeeId || "");
//       return orders.filter((order) => {
//         const orderUserId = String(order.userId || order.user_id || "");
//         const orderEmployeeId = String(order.employeeId || order.employee_id || "");
//         return orderUserId === currentUserId || orderEmployeeId === currentUserId;
//       });
//     }
//     return orders;
//   }, [orders, isAdmin, user]);
// console.log("visibleOrders",visibleOrders);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.drinkType || !form.quantity) return;

    const payload = {
      drinkType: form.drinkType,
      quantity: Number(form.quantity),
      dateTime: form.dateTime ? new Date(form.dateTime).toISOString() : new Date().toISOString(),
      userId: user?.id || "",
      role: user?.role || "",
      employeeId: user?.employeeId || "",
      employeeName: user?.fullName || "",
    };

    if (editingId) {
      await dispatch(updateOrder({ id: editingId, updates: payload }));
      setEditingId(null);
    } else {
      await dispatch(createOrder(payload));
    }
    setForm(emptyForm);
    await dispatch(fetchOrders({ user, isAdmin }));
  };

  const handleEdit = (order) => {
    setEditingId(order.id);
    setForm({
      employeeId: order.employeeId || "",
      employeeName: order.employeeName || "",
      drinkType: order.drinkType || "Tea",
      quantity: order.quantity || 1,
      dateTime: order.dateTime || "",
    });
  };

  const handleDelete = async (id) => {
    await dispatch(deleteOrder(id));
  };

  return (
    <section>
      <div className="page-title">
        <div>
          <h1>Orders</h1>
          <p>{isAdmin ? "Manage all drink orders" : "Manage your drink orders"}</p>
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}

      {!isAdmin && (
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem", maxWidth: "480px", marginBottom: "1.5rem" }}>
        {!isAdmin && (
          <>
            <input
              value={form.employeeId}
              onChange={(event) => setForm((current) => ({ ...current, employeeId: event.target.value }))}
              placeholder="Employee ID"
            />
            <input
              value={form.employeeName}
              onChange={(event) => setForm((current) => ({ ...current, employeeName: event.target.value }))}
              placeholder="Employee Name"
            />
          </>
        )}
          <select value={form.drinkType} onChange={(event) => setForm((current) => ({ ...current, drinkType: event.target.value }))}>
            <option value="Tea">Tea</option>
            <option value="Coffee">Coffee</option>
          </select>
          <input
            type="number"
            min="1"
            value={form.quantity}
            onChange={(event) => setForm((current) => ({ ...current, quantity: Number(event.target.value) }))}
            placeholder="Quantity of cups"
          />
          <input
            type="datetime-local"
            value={form.dateTime}
            onChange={(event) => setForm((current) => ({ ...current, dateTime: event.target.value }))}
            placeholder="Date Time"
          />
          <button type="submit">{editingId ? "Update Order" : "Add Order"}</button>
        </form>
      )}

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {isAdmin && <th>ID</th>}
                {isAdmin && <th>Employee ID</th>}
                {isAdmin && <th>Employee Name</th>}
                <th>Drink Type</th>
                <th>Quantity</th>
                <th>Date Time</th>
                {!isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  {isAdmin && <td>{order.employeeId}</td>}
                  {isAdmin && <td>{order.employeeName}</td>}
                  <td>{order.drinkType}</td>
                  <td>{order.quantity}</td>
                  <td>{order.dateTime}</td>
                  {!isAdmin && (
                    <td>
                      <div className="row-actions">
                        <button type="button" onClick={() => handleEdit(order)}>
                          Edit
                        </button>
                        <button type="button" className="danger-link" onClick={() => handleDelete(order.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default OrdersPage;
