import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService from "../../services/userService";

const getErrorMessage = (error) => error?.message || "Something went wrong.";
const normalizeRejectedError = (error) =>
  error?.message || (typeof error === "string" ? error : "Something went wrong.");

export const fetchUsers = createAsyncThunk(
  "/users",
  async (filters = {}, { rejectWithValue }) => {
    try {
      return await userService.getUsers(filters);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id, { rejectWithValue }) => {
    try {
      return await userService.getUserById(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateUserById = createAsyncThunk(
  "users/updateUserById",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      return await userService.updateUser(id, updates);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const deleteUserById = createAsyncThunk(
  "users/deleteUserById",
  async (id, { rejectWithValue }) => {
    try {
      await userService.deleteUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const setUserStatusById = createAsyncThunk(
  "users/setUserStatusById",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await userService.setUserStatus(id, status);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const initialState = {
  items: [],
  total: 0,
  page: 1,
  totalPages: 1,
  selectedUser: null,
  status: "idle",
  selectedStatus: "idle",
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUsersError(state) {
      state.error = null;
    },
    clearSelectedUser(state) {
      state.selectedUser = null;
      state.selectedStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
          state.total = action.payload.length;
          state.page = 1;
          state.totalPages = 1;
        } else {
          state.items = action.payload.users;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.totalPages = action.payload.totalPages;
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = normalizeRejectedError(action.payload) || action.error.message || "Something went wrong.";
      })
      .addCase(fetchUserById.pending, (state) => {
        state.selectedStatus = "loading";
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.selectedStatus = "succeeded";
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.selectedStatus = "failed";
        state.error = normalizeRejectedError(action.payload) || action.error.message || "Something went wrong.";
      })
      .addCase(updateUserById.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
        state.items = state.items.map((user) => (user.id === action.payload.id ? action.payload : user));
      })
      .addCase(deleteUserById.fulfilled, (state, action) => {
        state.items = state.items.filter((user) => user.id !== action.payload);
      })
      .addCase(setUserStatusById.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
        state.items = state.items.map((user) => (user.id === action.payload.id ? action.payload : user));
      });
  },
});

export const { clearUsersError, clearSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;
