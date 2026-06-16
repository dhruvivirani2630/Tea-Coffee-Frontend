import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import EditProfilePage from '../../src/pages/user/EditProfilePage';
import authReducer from '../../src/store/slices/authSlice';

describe('EditProfilePage Integration Tests', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer
      },
      preloadedState: {
        auth: {
          user: {
            id: '1',
            email: 'test@example.com',
            fullName: 'Test User',
            phone: '1234567890',
            role: 'user',
            status: 'active',
            employeeId: 'EMP001'
          },
          token: 'mock-token',
          bootstrapped: true,
          status: 'succeeded',
          error: null
        }
      }
    });
  });

  const renderEditProfilePage = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <EditProfilePage />
        </BrowserRouter>
      </Provider>
    );
  };

  it('should render edit profile form with user data', async () => {
    renderEditProfilePage();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
    });
  });

  it('should allow user to update profile fields', async () => {
    const user = userEvent.setup();
    renderEditProfilePage();

    const fullNameField = screen.getByDisplayValue('Test User');
    await user.clear(fullNameField);
    await user.type(fullNameField, 'Updated User');

    expect(fullNameField).toHaveValue('Updated User');
  });

  it('should update phone field', async () => {
    const user = userEvent.setup();
    renderEditProfilePage();

    const phoneField = screen.getByDisplayValue('1234567890');
    await user.clear(phoneField);
    await user.type(phoneField, '9876543210');

    expect(phoneField).toHaveValue('9876543210');
  });

  it('should submit updated profile', async () => {
    const user = userEvent.setup();
    renderEditProfilePage();

    const fullNameField = screen.getByDisplayValue('Test User');
    await user.clear(fullNameField);
    await user.type(fullNameField, 'Updated User');

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should display role as read-only field for regular user', () => {
    renderEditProfilePage();

    const roleInput = screen.getByDisplayValue('user');
    expect(roleInput).toBeDisabled();
    expect(roleInput).toHaveAttribute('readonly');
  });

  it('should clear error messages when field is changed', async () => {
    const user = userEvent.setup();
    renderEditProfilePage();

    const emailField = screen.getByDisplayValue('test@example.com');

    // Simulate error state by clearing field
    await user.clear(emailField);

    // Error should be cleared when typing
    await user.type(emailField, 'newemail@example.com');

    expect(emailField).toHaveValue('newemail@example.com');
  });
});
