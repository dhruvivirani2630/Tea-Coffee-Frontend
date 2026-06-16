import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import PrivateRoute from '../../src/components/PrivateRoute';
import AdminRoute from '../../src/components/AdminRoute';
import authReducer from '../../src/store/slices/authSlice';

describe('Protected Routes Integration Tests', () => {
  const ProtectedComponent = () => <div>Protected Content</div>;
  const AdminComponent = () => <div>Admin Content</div>;
  const LoginComponent = () => <div>Login Page</div>;

  it('should allow access to private route when user is authenticated', () => {
    const store = configureStore({
      reducer: {
        auth: authReducer
      },
      preloadedState: {
        auth: {
          user: {
            id: '1',
            email: 'test@example.com',
            role: 'user'
          },
          token: 'mock-token',
          bootstrapped: true,
          status: 'succeeded',
          error: null
        }
      }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginComponent />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<ProtectedComponent />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    const store = configureStore({
      reducer: {
        auth: authReducer
      },
      preloadedState: {
        auth: {
          user: null,
          token: null,
          bootstrapped: true,
          status: 'succeeded',
          error: null
        }
      }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginComponent />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<ProtectedComponent />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should allow access to admin route when user is admin', () => {
    const store = configureStore({
      reducer: {
        auth: authReducer
      },
      preloadedState: {
        auth: {
          user: {
            id: '1',
            email: 'admin@example.com',
            role: 'admin'
          },
          token: 'mock-token',
          bootstrapped: true,
          status: 'succeeded',
          error: null
        }
      }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginComponent />} />
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminComponent />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('should deny access to admin route when user is not admin', () => {
    const store = configureStore({
      reducer: {
        auth: authReducer
      },
      preloadedState: {
        auth: {
          user: {
            id: '1',
            email: 'test@example.com',
            role: 'user'
          },
          token: 'mock-token',
          bootstrapped: true,
          status: 'succeeded',
          error: null
        }
      }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginComponent />} />
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminComponent />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });
});
