import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createOrder, deleteOrder, fetchOrders, updateOrder } from "../../store/slices/ordersSlice";
import { isAdminRole } from "../../constants/roles";
import AddEditOrderModal from "../../components/common/AddEditOrderModal";

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const orders = useAppSelector((state) => state.orders.items);
  const loading = useAppSelector((state) => state.orders.status === "loading");
  const error = useAppSelector((state) => state.orders.error);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const isAdmin = isAdminRole(user?.role);

  useEffect(() => {
    dispatch(fetchOrders({ user, isAdmin }));
  }, [dispatch, user, isAdmin]);

  const handleFormSubmit = async (payload) => {
    if (editingOrder) {
      await dispatch(updateOrder({ id: editingOrder.id, updates: payload }));
    } else {
      await dispatch(createOrder(payload));
    }
    setEditingOrder(null);
    setIsModalOpen(false);
    await dispatch(fetchOrders({ user, isAdmin }));
  };

  const handleAddClick = () => {
    setEditingOrder(null);
    setIsModalOpen(true);
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this order?")) {
      await dispatch(deleteOrder(id));
      await dispatch(fetchOrders({ user, isAdmin }));
    }
  };

  const handleCloseModal = () => {
    setEditingOrder(null);
    setIsModalOpen(false);
  };

  return (
    <section>
      <div className="page-title">
        <div>
          <h1>Orders</h1>
          <p>{isAdmin ? "Manage all drink orders" : "Manage your drink orders"}</p>
        </div>
        {!isAdmin && (
          <button className="btn-primary" onClick={handleAddClick}>
            + Add Order
          </button>
        )}
      </div>

      {error && <div className="alert error">{error}</div>}

      <AddEditOrderModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        editingOrder={editingOrder}
        user={user}
        isAdmin={isAdmin}
      />

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Drink Type</th>
                <th>Quantity</th>
                <th>Date Time</th>
                {isAdmin && <th>Employee ID</th>}
                {isAdmin && <th>Employee Name</th>}
                {!isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.drinkType}</td>
                  <td>{order.quantity}</td>
                  <td>{order.dateTime}</td>
                  {isAdmin && <td>{order.employeeId}</td>}
                  {isAdmin && <td>{order.employeeName}</td>}
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
