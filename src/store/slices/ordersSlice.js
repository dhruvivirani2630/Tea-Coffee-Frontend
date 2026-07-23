import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import orderService from "../../services/orderService";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

const getErrorMessage = (error) => error?.message || "Something went wrong.";

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

export const fetchOrders = createAsyncThunk(
  "orders/getOrders",
  async ({ user, isAdmin }, { rejectWithValue }) => {
    try {
      return await orderService.getOrders({ user, isAdmin });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (payload, { rejectWithValue }) => {
    try {
      return await orderService.createOrder(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      return await orderService.updateOrder(id, updates);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      return await orderService.deleteOrder(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to load orders.";
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.items = state.items.map((order) => (order.id === action.payload.id ? action.payload : order));
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.items = state.items.filter((order) => order.id !== action.payload);
      });
  },
});

export default ordersSlice.reducer;
