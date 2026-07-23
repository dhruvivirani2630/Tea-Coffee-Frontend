import axiosClient from "../api/axiosClient";

const ORDERS_ENDPOINT = "orders";
const ORDERS_STORAGE_KEY = "orders_data";

const getErrorMessage = (error, fallback = "Something went wrong.") => {
  const data = error?.response?.data || {};
  return data.message || error?.message || fallback;
};

const getStoredOrders = () => {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStoredOrders = (orders) => {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
};

const normalizeOrder = (order) => ({
  id: order.id || order._id || order.orderId || "",
  employeeId: order.employeeId || order.employee_id || "",
  employeeName: order.employeeName || order.employee_name || order.fullName || "",
  drinkType: order.drinkType || order.drink_type || "",
  quantity: order.quantity || 0,
  dateTime: order.dateTime || order.date_time || order.createdAt || order.createdDate || "",
  userId: order.userId || order.user_id || order.createdBy || "",
  role: order.role || "",
});

const filterOrdersForUser = (orders, user, isAdmin) => {
  if (isAdmin) return orders;
  const currentUserId = String(user?.id || user?.employeeId || user?.email || "");
  return orders.filter((order) => {
    const orderUserId = String(order.userId || order.user_id || "");
    const orderEmployeeId = String(order.employeeId || order.employee_id || "");
    return orderUserId === currentUserId || orderEmployeeId === currentUserId;
  });
};

const orderService = {
  async getOrders({ user, isAdmin } = {}) {
    try {
      const response = await axiosClient.get(ORDERS_ENDPOINT + "/getOrders");
      const payload = response?.data?.data || response?.data || {};
      const serverOrders = Array.isArray(payload) ? payload : payload.orders || [];
      const normalized = serverOrders.map(normalizeOrder);
      saveStoredOrders(normalized);
      return normalized;
    } catch (error) {
      const localOrders = getStoredOrders().map(normalizeOrder);
      return localOrders;
    }
  },

  async createOrder(payload) {
    try {
      const response = await axiosClient.post(ORDERS_ENDPOINT + "/createOrders", payload);
      const created = normalizeOrder(response?.data?.data || response?.data || payload);
      const orders = [...getStoredOrders(), created];
      saveStoredOrders(orders);
      return created;
    } catch (error) {
      const created = normalizeOrder({ ...payload, id: Date.now() });
      const orders = [...getStoredOrders(), created];
      saveStoredOrders(orders);
      return created;
    }
  },

  async updateOrder(id, updates) {
    try {
      const response = await axiosClient.put(`${ORDERS_ENDPOINT}/${id}`, updates);
      const updated = normalizeOrder(response?.data?.data || response?.data || { id, ...updates });
      const orders = getStoredOrders().map((order) => (String(order.id) === String(id) ? updated : order));
      saveStoredOrders(orders);
      return updated;
    } catch (error) {
      const updated = normalizeOrder({ id, ...updates });
      const orders = getStoredOrders().map((order) => (String(order.id) === String(id) ? updated : order));
      saveStoredOrders(orders);
      return updated;
    }
  },

  async deleteOrder(id) {
    try {
      await axiosClient.delete(`${ORDERS_ENDPOINT}/${id}`);
    } catch (error) {
      // fall through to local storage update
    }

    const orders = getStoredOrders().filter((order) => String(order.id) !== String(id));
    saveStoredOrders(orders);
    return id;
  },
};

export default orderService;
