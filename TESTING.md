# Testing Infrastructure Documentation

## Overview

This project has a complete automated testing infrastructure with unit tests, integration tests, and end-to-end tests using Jest, React Testing Library, and Playwright.

## Directory Structure

```
tests/
├── e2e/                    # End-to-end tests (Playwright)
│   ├── auth.spec.js       # Authentication flow tests
│   ├── profile.spec.js    # Profile update tests
│   └── admin.spec.js      # Admin user management tests
├── integration/           # Integration tests
│   ├── LoginPage.test.js
│   ├── SignupPage.test.js
│   ├── EditProfilePage.test.js
│   └── ProtectedRoutes.test.js
├── unit/                  # Unit tests
│   └── authSlice.test.js
├── mocks/
│   ├── server.js         # MSW server setup
│   ├── handlers.js       # API mock handlers
│   └── fileMock.js       # File mock for CSS/images
├── utils/
│   └── test-utils.js     # Testing utilities
└── setupTests.js         # Jest setup configuration
```

## Running Tests

### Unit & Integration Tests (Jest)

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Generate coverage report
npm run test:coverage
```

### End-to-End Tests (Playwright)

```bash
# Run all E2E tests
npm run e2e

# Run E2E tests in UI mode (interactive)
npm run e2e:ui

# Debug E2E tests
npm run e2e:debug

# View E2E test report
npm run e2e:report
```

### Auth API Test Setup

The auth automation uses a small in-memory API mock in `tests/e2e/support/authApi.js`.

- `POST /auth/register` creates a new user in the mock database and returns the created record
- `POST /auth/login` validates the user against seeded users and newly registered users
- `GET /auth/profile` returns a null session for fresh test runs
- `GET /users` returns seeded users for the admin dashboard

Run only the auth flows with:

```bash
npm run test:auth
```

## Test Coverage

Coverage thresholds are set to 50% across all metrics. View coverage reports:

```bash
npm run test:coverage
# Opens coverage/lcov-report/index.html
```

## Writing Tests

### Unit Tests

Test Redux slices and utility functions in isolation:

```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../src/store/slices/authSlice';

describe('authSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer
      }
    });
  });

  it('should handle login', async () => {
    // Test implementation
  });
});
```

### Integration Tests

Test components with Redux and React Router:

```javascript
import { renderWithProviders as render } from '../../tests/utils/test-utils';
import LoginPage from '../../src/pages/auth/LoginPage';

describe('LoginPage', () => {
  it('should render login form', () => {
    render(<LoginPage />);
    // Test implementation
  });
});
```

### End-to-End Tests

Test user workflows in a real browser:

```javascript
import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test('should login with valid credentials', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Test@123');
    await page.click('button:has-text("Login")');
    await page.waitForURL('**/dashboard');
  });
});
```

## API Mocking with MSW

All API calls are mocked using Mock Service Worker (MSW). Handlers are defined in `tests/mocks/handlers.js`.

### Adding New Mocks

```javascript
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/endpoint', () => {
    return HttpResponse.json({
      data: { /* response */ }
    });
  })
];
```

## Test Utilities

Use `renderWithProviders` helper for testing components with Redux:

```javascript
import { renderWithProviders as render } from '../utils/test-utils';

render(<Component />, {
  preloadedState: {
    auth: {
      user: { id: '1', email: 'test@example.com' },
      token: 'mock-token'
    }
  }
});
```

## CI/CD Integration

Tests are configured to run in CI/CD pipelines. Environment variables:

- `CI=true` - Run tests in CI mode (no cache, 2 retries)
- `VITE_USE_MOCK_API=true` - Use mock API (default)

## Coverage Reporting

Supported formats:
- HTML (opens in browser)
- JUNIT XML (for CI/CD integration)
- JSON (for analysis)

View HTML coverage:
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

## Best Practices

1. **Test naming**: Use descriptive test names that explain the behavior
2. **Arrange-Act-Assert**: Structure tests with setup, action, and assertion
3. **Mock external APIs**: Use MSW for all API calls
4. **Don't test implementation**: Test user-facing behavior
5. **Use data-testid sparingly**: Prefer accessible queries (role, label, text)
6. **Keep tests isolated**: Each test should be independent
7. **Use fixtures**: Create reusable test data

## Debugging Tests

### Debug Jest Tests

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Debug E2E Tests

```bash
npm run e2e:debug
```

### View Playwright Videos/Screenshots

E2E tests automatically capture videos and screenshots on failure in `test-results/` directory.

## Troubleshooting

### Tests timeout
- Increase timeout in test file: `test.setTimeout(10000)`
- Check if API mock is working correctly
- Verify element selectors match your app

### Module not found errors
- Run `npm install` to ensure all dependencies are installed
- Check moduleNameMapper in jest.config.js

### E2E tests can't find elements
- Use `page.pause()` to pause and inspect
- Use `page.screenshot()` to capture state
- Verify selectors with browser dev tools

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Mock Service Worker](https://mswjs.io/)
