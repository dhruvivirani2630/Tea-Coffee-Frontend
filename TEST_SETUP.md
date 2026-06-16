# Test Configuration Files

## jest.config.js
- Test environment: jsdom (for DOM testing)
- Test discovery: `**/?(*.)+(spec|test).js` patterns
- Module name mapping for CSS and image files
- Setup file: setupTests.js
- Coverage thresholds: 50% across all metrics
- Coverage collection from src/ directory

## setupTests.js
- Loads @testing-library/jest-dom matchers
- Sets up MSW server for API mocking
- Mocks window.matchMedia for responsive design tests
- Resets handlers between tests
- Cleans up after all tests

## Playwright Configuration
- Multiple browser support: Chrome, Firefox, Safari
- Mobile device support: Pixel 5, iPhone 12
- Report formats: HTML, JUnit XML, JSON
- Screenshots and videos on failure
- Automatic retry in CI/CD
- Dev server integration (npm run dev)
