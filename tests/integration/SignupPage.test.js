import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import SignupPage from '../../src/pages/auth/SignupPage';
import authReducer from '../../src/store/slices/authSlice';

describe('SignupPage Integration Tests', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer
      }
    });
  });

  const renderSignupPage = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <SignupPage />
        </BrowserRouter>
      </Provider>
    );
  };

  it('should render signup form with all required fields', () => {
    renderSignupPage();

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('should display validation errors for empty fields', async () => {
    const user = userEvent.setup();
    renderSignupPage();

    const signupButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(signupButton);

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it('should display error if passwords do not match', async () => {
    const user = userEvent.setup();
    renderSignupPage();

    const fullNameField = screen.getByLabelText(/full name/i);
    const emailField = screen.getByLabelText(/email/i);
    const passwordField = screen.getByLabelText(/^password/i);
    const confirmPasswordField = screen.getByLabelText(/confirm password/i);

    await user.type(fullNameField, 'Test User');
    await user.type(emailField, 'test@example.com');
    await user.type(passwordField, 'Test@123');
    await user.type(confirmPasswordField, 'Different@123');

    const signupButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(signupButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('should submit signup form with valid data', async () => {
    const user = userEvent.setup();
    renderSignupPage();

    const fullNameField = screen.getByLabelText(/full name/i);
    const emailField = screen.getByLabelText(/email/i);
    const passwordField = screen.getByLabelText(/^password/i);
    const confirmPasswordField = screen.getByLabelText(/confirm password/i);

    await user.type(fullNameField, 'Test User');
    await user.type(emailField, 'newuser@example.com');
    await user.type(passwordField, 'Test@123');
    await user.type(confirmPasswordField, 'Test@123');

    const signupButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(signupButton);

    await waitFor(() => {
      expect(signupButton).not.toBeDisabled();
    });
  });

  it('should have link to login page', () => {
    renderSignupPage();

    const loginLink = screen.getByRole('link', { name: /log in/i });
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});
