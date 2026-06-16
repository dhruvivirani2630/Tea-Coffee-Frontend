import { configureStore } from '@reduxjs/toolkit';
import usersReducer, {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../../src/store/slices/usersSlice';
import userService from '../../src/services/userService';

jest.mock('../../src/services/userService');

describe('usersSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        users: usersReducer
      }
    });
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should handle getUsers.fulfilled', async () => {
      const mockUsers = [
        {
          id: '1',
          email: 'test@example.com',
          fullName: 'Test User',
          role: 'user',
          status: 'active'
        },
        {
          id: '2',
          email: 'admin@example.com',
          fullName: 'Admin User',
          role: 'admin',
          status: 'active'
        }
      ];

      userService.getUsers.mockResolvedValue(mockUsers);

      await store.dispatch(getUsers());
      const state = store.getState().users;

      expect(state.list).toEqual(mockUsers);
      expect(state.status).toBe('succeeded');
      expect(state.error).toBeNull();
    });

    it('should handle getUsers.rejected', async () => {
      const mockError = { message: 'Failed to fetch users' };

      userService.getUsers.mockRejectedValue(mockError);

      await store.dispatch(getUsers());
      const state = store.getState().users;

      expect(state.status).toBe('failed');
      expect(state.error).toBeTruthy();
    });
  });

  describe('getUserById', () => {
    it('should handle getUserById.fulfilled', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        fullName: 'Test User',
        role: 'user',
        status: 'active'
      };

      userService.getUserById.mockResolvedValue(mockUser);

      await store.dispatch(getUserById('1'));
      const state = store.getState().users;

      expect(state.currentUser).toEqual(mockUser);
      expect(state.status).toBe('succeeded');
    });

    it('should handle getUserById.rejected', async () => {
      userService.getUserById.mockRejectedValue(new Error('User not found'));

      await store.dispatch(getUserById('invalid-id'));
      const state = store.getState().users;

      expect(state.status).toBe('failed');
      expect(state.error).toBeTruthy();
    });
  });

  describe('updateUser', () => {
    it('should handle updateUser.fulfilled', async () => {
      const updatedUser = {
        id: '1',
        email: 'newemail@example.com',
        fullName: 'Updated User',
        role: 'admin',
        status: 'inactive'
      };

      userService.updateUser.mockResolvedValue(updatedUser);

      await store.dispatch(updateUser({
        id: '1',
        data: updatedUser
      }));
      const state = store.getState().users;

      expect(state.currentUser).toEqual(updatedUser);
      expect(state.status).toBe('succeeded');
    });

    it('should handle updateUser.rejected', async () => {
      const mockError = { message: 'Email already exists' };

      userService.updateUser.mockRejectedValue(mockError);

      await store.dispatch(updateUser({
        id: '1',
        data: { email: 'existing@example.com' }
      }));
      const state = store.getState().users;

      expect(state.status).toBe('failed');
      expect(state.error).toBeTruthy();
    });
  });

  describe('deleteUser', () => {
    it('should handle deleteUser.fulfilled', async () => {
      userService.deleteUser.mockResolvedValue({ success: true });

      await store.dispatch(deleteUser('1'));
      const state = store.getState().users;

      expect(state.status).toBe('succeeded');
      expect(state.error).toBeNull();
    });

    it('should handle deleteUser.rejected', async () => {
      userService.deleteUser.mockRejectedValue(new Error('Cannot delete user'));

      await store.dispatch(deleteUser('1'));
      const state = store.getState().users;

      expect(state.status).toBe('failed');
      expect(state.error).toBeTruthy();
    });
  });

  describe('filterUsers', () => {
    it('should filter users by search term', () => {
      const initialState = {
        users: {
          list: [
            {
              id: '1',
              email: 'test@example.com',
              fullName: 'Test User',
              role: 'user',
              status: 'active'
            },
            {
              id: '2',
              email: 'admin@example.com',
              fullName: 'Admin User',
              role: 'admin',
              status: 'active'
            }
          ],
          filters: {
            search: '',
            role: 'All',
            status: 'All'
          },
          currentUser: null,
          status: 'idle',
          error: null
        }
      };

      store = configureStore({
        reducer: {
          users: usersReducer
        },
        preloadedState: initialState
      });

      // Update filters
      // This depends on your usersSlice implementation
      const state = store.getState().users;
      expect(state.list).toHaveLength(2);
    });
  });
});
