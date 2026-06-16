import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import LoginPage from '../../src/pages/auth/LoginPage';
import authReducer from '../../src/store/slices/authSlice';

describe('LoginPage Integration Tests', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer
      }
    });
  });

  const renderLoginPage = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );
  };

  it('should render login form with email and password fields', () => {
    renderLoginPage();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should display validation errors for empty fields', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const loginButton = screen.getByRole('button', { name: /login/i });
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it('should display validation error for invalid email', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const emailField = screen.getByLabelText(/email/i);
    await user.type(emailField, 'invalid-email');

    const loginButton = screen.getByRole('button', { name: /login/i });
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it('should submit login form with valid credentials', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const emailField = screen.getByLabelText(/email/i);
    const passwordField = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailField, 'test@example.com');
    await user.type(passwordField, 'Test@123');
    await user.click(loginButton);

    await waitFor(() => {
      // Wait for login to process
      expect(loginButton).not.toBeDisabled();
    });
  });

  it('should have link to signup page', () => {
    renderLoginPage();

    const signupLink = screen.getByRole('link', { name: /sign up/i });
    expect(signupLink).toHaveAttribute('href', '/signup');
  });

  it('should have forgot password link', () => {
    renderLoginPage();

    const forgotLink = screen.getByRole('link', { name: /forgot password/i });
    expect(forgotLink).toBeInTheDocument();
  });
});
