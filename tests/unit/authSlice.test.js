import { configureStore } from '@reduxjs/toolkit';
import authReducer, {
  hydrateSession,
  loginUser,
  signupUser,
  logoutUser,
  refreshCurrentUser,
  updateCurrentUserProfile
} from '../../src/store/slices/authSlice';
import authService from '../../src/services/authService';
import userService from '../../src/services/userService';

jest.mock('../../src/services/authService');
jest.mock('../../src/services/userService');

describe('authSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer
      }
    });
    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    it('should handle loginUser.fulfilled', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        fullName: 'Test User',
        token: 'mock-token'
      };

      authService.login.mockResolvedValue(mockUser);

      await store.dispatch(loginUser({ email: 'test@example.com', password: 'password' }));
      const state = store.getState().auth;

      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe('mock-token');
      expect(state.status).toBe('succeeded');
    });

    it('should handle loginUser.rejected', async () => {
      const mockError = { message: 'Invalid credentials' };

      authService.login.mockRejectedValue(mockError);

      await store.dispatch(loginUser({ email: 'test@example.com', password: 'wrong' }));
      const state = store.getState().auth;

      expect(state.status).toBe('failed');
      expect(state.error).toBeTruthy();
    });
  });

  describe('signupUser', () => {
    it('should handle signupUser.fulfilled', async () => {
      const mockUser = {
        id: '2',
        email: 'newuser@example.com',
        fullName: 'New User',
        token: 'new-token'
      };

      authService.signup.mockResolvedValue(mockUser);

      await store.dispatch(signupUser({
        email: 'newuser@example.com',
        fullName: 'New User',
        password: 'Test@123'
      }));
      const state = store.getState().auth;

      expect(state.user).toEqual(mockUser);
      expect(state.status).toBe('succeeded');
    });

    it('should handle signupUser.rejected', async () => {
      const mockError = { message: 'Email already exists' };

      authService.signup.mockRejectedValue(mockError);

      await store.dispatch(signupUser({
        email: 'existing@example.com',
        fullName: 'User',
        password: 'Test@123'
      }));
      const state = store.getState().auth;

      expect(state.status).toBe('failed');
    });
  });

  describe('logoutUser', () => {
    it('should handle logoutUser.fulfilled', async () => {
      // First set a user
      store = configureStore({
        reducer: {
          auth: authReducer
        },
        preloadedState: {
          auth: {
            user: { id: '1', email: 'test@example.com' },
            token: 'mock-token',
            bootstrapped: true,
            status: 'succeeded',
            error: null
          }
        }
      });

      authService.logout.mockResolvedValue(null);

      await store.dispatch(logoutUser());
      const state = store.getState().auth;

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.status).toBe('succeeded');
    });
  });

  describe('refreshCurrentUser', () => {
    it('should handle refreshCurrentUser.fulfilled', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        fullName: 'Test User'
      };

      userService.getProfile.mockResolvedValue(mockUser);

      await store.dispatch(refreshCurrentUser());
      const state = store.getState().auth;

      expect(state.user).toEqual(mockUser);
      expect(state.status).toBe('succeeded');
    });
  });

  describe('updateCurrentUserProfile', () => {
    it('should handle updateCurrentUserProfile.fulfilled', async () => {
      const mockUpdatedUser = {
        id: '1',
        email: 'newemail@example.com',
        fullName: 'Updated Name'
      };

      userService.updateProfile.mockResolvedValue(mockUpdatedUser);

      await store.dispatch(updateCurrentUserProfile({ fullName: 'Updated Name' }));
      const state = store.getState().auth;

      expect(state.user).toEqual(mockUpdatedUser);
      expect(state.status).toBe('succeeded');
    });

    it('should handle updateCurrentUserProfile.rejected', async () => {
      const mockError = { message: 'Email already exists' };

      userService.updateProfile.mockRejectedValue(mockError);

      await store.dispatch(updateCurrentUserProfile({ email: 'existing@example.com' }));
      const state = store.getState().auth;

      expect(state.status).toBe('failed');
    });
  });

  describe('hydrateSession', () => {
    it('should handle hydrateSession.fulfilled', async () => {
      const mockSession = {
        user: { id: '1', email: 'test@example.com' },
        token: 'mock-token'
      };

      authService.getSession.mockResolvedValue(mockSession);

      await store.dispatch(hydrateSession());
      const state = store.getState().auth;

      expect(state.user).toEqual(mockSession.user);
      expect(state.token).toBe('mock-token');
      expect(state.bootstrapped).toBe(true);
    });

    it('should set bootstrapped to true on rejection', async () => {
      authService.getSession.mockRejectedValue(new Error('No session'));

      await store.dispatch(hydrateSession());
      const state = store.getState().auth;

      expect(state.bootstrapped).toBe(true);
      expect(state.status).toBe('failed');
    });
  });
});
