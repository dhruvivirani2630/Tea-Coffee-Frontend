import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../../services/authService";
import userService from "../../services/userService";
import { sanitizeUserRecord } from "../../utils/userModel";

const normalizeAuthUser = (user) => (user ? sanitizeUserRecord(user) : null);

const getErrorMessage = (error) => error?.message || "Something went wrong.";
const normalizeRejectedError = (error) =>
  error?.message || (typeof error === "string" ? error : "Something went wrong.");

export const hydrateSession = createAsyncThunk(
  "auth/hydrateSession",
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getSession();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      return await authService.login(credentials);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const signupUser = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      return await authService.signup(payload);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return null;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const refreshCurrentUser = createAsyncThunk(
  "auth/refreshCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getProfile();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateCurrentUserProfile = createAsyncThunk(
  "users/update-profile",
  async (profile, { rejectWithValue }) => {
    try {
      return await userService.updateProfile(profile);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const initialState = {
  user: null,
  token: null,
  bootstrapped: false,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.status = "loading";
      state.error = null;
    };

    const fulfilled = (state, action) => {
      state.status = "succeeded";
      state.error = null;
      if (action.payload) {
        state.user = normalizeAuthUser(action.payload.user ?? action.payload);
        state.token = action.payload.token ?? state.token;
      }
    };

    const rejected = (state, action) => {
      state.status = "failed";
      state.error = normalizeRejectedError(action.payload) || action.error.message || "Something went wrong.";
    };

    builder
      .addCase(hydrateSession.pending, pending)
      .addCase(hydrateSession.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bootstrapped = true;
        state.error = null;
        state.user = normalizeAuthUser(action.payload?.user ?? null);
        state.token = action.payload?.token ?? null;
      })
      .addCase(hydrateSession.rejected, (state, action) => {
        rejected(state, action);
        state.bootstrapped = true;
      })
      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, fulfilled)
      .addCase(loginUser.rejected, rejected)
      .addCase(signupUser.pending, pending)
      .addCase(signupUser.fulfilled, fulfilled)
      .addCase(signupUser.rejected, rejected)
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(logoutUser.rejected, rejected)
      .addCase(refreshCurrentUser.fulfilled, (state, action) => {
        state.user = normalizeAuthUser(action.payload);
      })
      .addCase(refreshCurrentUser.rejected, rejected)
      .addCase(updateCurrentUserProfile.fulfilled, (state, action) => {
        state.user = normalizeAuthUser(action.payload);
      })
      .addCase(updateCurrentUserProfile.rejected, rejected);
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
