import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  loginUser,
  logoutUser,
  refreshCurrentUser,
  signupUser,
  updateCurrentUserProfile,
} from "../store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  return useMemo(
    () => ({
      user: auth.user,
      token: auth.token,
      loading: auth.status === "loading",
      isAuthenticated: Boolean(auth.user && auth.token),
      isAdmin: auth.user?.role === "Admin",
      login: (credentials) => dispatch(loginUser(credentials)).unwrap(),
      signup: (payload) => dispatch(signupUser(payload)).unwrap(),
      logout: () => dispatch(logoutUser()).unwrap(),
      refreshProfile: () => dispatch(refreshCurrentUser()).unwrap(),
      updateProfile: (profile) => dispatch(updateCurrentUserProfile(profile)).unwrap(),
    }),
    [auth, dispatch],
  );
};
