# Playwright Testing Guide for InvParser UI

This guide explains how to set up and run Playwright tests for the Invoice Parser UI application.

## Overview

The test suite includes:
- **Basic UI tests**: Page title, redirects, and basic functionality
- **User journey tests**: Complete end-to-end flows (login, navigation, logout)
- **Component tests**: Individual UI components (login form, navigation, upload, invoice table)
- **Advanced tests**: Tracing, authentication state reuse, and clock manipulation

## Installation

### 1. Install Python dependencies

Make sure you're in your virtual environment, then install the required packages:

```bash
# Activate your virtual environment first
source .venv/bin/activate  # On macOS/Linux
# or
.venv\Scripts\activate  # On Windows

# Install test dependencies
pip install -r requirements-test.txt
```

Or install manually:

```bash
pip install playwright pytest-playwright pytest-html pytest-cov
```

### 2. Install Playwright browsers

Playwright requires browser binaries to run tests. Install them with:

```bash
playwright install
```

This command downloads Chromium, Firefox, and WebKit browsers.

## Running Tests

### Prerequisites

**Important**: Make sure your Next.js application is running before executing tests!

```bash
cd invparser-ui
npm run dev
```

The application should be accessible at `http://localhost:3000`.

### Run all tests

```bash
# Run all tests with verbose output
pytest tests/ -v

# Run tests with pytest-playwright
pytest tests/
```

### Run specific test files

```bash
# Basic UI tests
pytest tests/test_ui.py -v

# User journey tests
pytest tests/test_user_journey.py -v

# Component tests
pytest tests/test_components.py -v

# Advanced tests (tracing, auth state, clock)
pytest tests/test_advanced.py -v
```

### Run specific test classes or methods

```bash
# Run a specific test class
pytest tests/test_components.py::TestLoginComponent -v

# Run a specific test method
pytest tests/test_user_journey.py::TestUserJourney::test_login_flow -v
```

### Run tests with different browsers

By default, tests run in Chromium. You can specify other browsers:

```bash
# Run in Firefox
pytest tests/ --browser firefox

# Run in WebKit (Safari)
pytest tests/ --browser webkit

# Run in all browsers
pytest tests/ --browser chromium --browser firefox --browser webkit
```

### Run tests in headless mode

For CI/CD or faster execution, run tests in headless mode:

To enable headless mode, modify the test files by changing:
```python
cls.browser = cls.playwright.chromium.launch(headless=False)
```
to:
```python
cls.browser = cls.playwright.chromium.launch(headless=True)
```

Or create a conftest.py file to control this globally.

## Test Organization

```
tests/
├── __init__.py                 # Test package initialization
├── test_ui.py                  # Basic UI tests (page title, redirects)
├── test_user_journey.py        # End-to-end user flows
├── test_components.py          # Component-specific tests
├── test_advanced.py            # Advanced features (tracing, auth, clock)
└── traces/                     # Test trace files (created on test failure)
```

## Test Categories

### 1. Basic UI Tests (`test_ui.py`)

Simple tests for basic page functionality:
- Page title verification
- Redirect to login for unauthenticated users

**Run**: `pytest tests/test_ui.py -v`

### 2. User Journey Tests (`test_user_journey.py`)

Complete end-to-end flows:
- Login flow (navigate → redirect → login → dashboard)
- Login and navigate to invoices
- Login and navigate to upload
- Logout flow

**Run**: `pytest tests/test_user_journey.py -v`

### 3. Component Tests (`test_components.py`)

Tests for specific UI components:

- **TestLoginComponent**: Login form validation, valid/invalid credentials
- **TestNavigationComponent**: Sidebar, topbar, navigation links
- **TestUploadComponent**: Upload page, dropzone, file input
- **TestInvoiceTableComponent**: Invoice table, headers, rows, click navigation

**Run**: `pytest tests/test_components.py -v`

### 4. Advanced Tests (`test_advanced.py`)

Demonstrates advanced Playwright features:

- **TestWithTracing**: Records traces for debugging failed tests
- **TestWithAuthState**: Reuses authentication state across tests (faster)
- **TestWithClock**: Manipulates time for time-dependent features

**Run**: `pytest tests/test_advanced.py -v`

## Advanced Features

### Trace Viewer

When tests fail, traces are automatically saved to `tests/traces/` (for tests in `test_advanced.py`).

View a trace file:
```bash
playwright show-trace tests/traces/test_login_with_tracing_trace.zip
```

The trace viewer shows:
- Screenshots at each step
- DOM snapshots
- Network requests
- Console logs
- Test source code

### Authentication State Reuse

The `TestWithAuthState` class demonstrates how to:
1. Login once and save authentication state to `playwright/.auth/user.json`
2. Reuse this state across all tests in the class
3. Skip login steps in subsequent tests (faster execution)

This is especially useful for test suites with many tests that require authentication.

### Clock Manipulation

The `TestWithClock` class shows how to control time in tests:
```python
# Set clock to specific time
self.page.clock.install(time="2024-01-01T10:00:00")

# Fast forward 30 minutes
self.page.clock.fast_forward(30 * 60 * 1000)
```

Useful for testing:
- Session timeouts
- Date-based features
- Scheduled notifications
- Time-dependent UI changes

## Test Credentials

The application uses dummy authentication with:
- **Email/Username**: `admin`
- **Password**: `admin`

These credentials are used throughout the test suite.

## Troubleshooting

### Tests fail with "Page timeout" errors

**Solution**: Make sure your Next.js app is running on `http://localhost:3000`

```bash
cd invparser-ui
npm run dev
```

### Browser doesn't open

**Solution**: Install browser binaries

```bash
playwright install
```

### Tests fail with "Element not found"

**Possible causes**:
1. Application is still loading - increase timeout
2. Selectors have changed - update locators in tests
3. CSS styling issues - check if elements are actually visible

### Authentication state tests fail

**Solution**: Delete saved auth state and let tests recreate it

```bash
rm -rf playwright/.auth/user.json
pytest tests/test_advanced.py::TestWithAuthState -v
```

## Continuous Integration

For CI/CD pipelines, use headless mode and install dependencies:

```yaml
# Example GitHub Actions
- name: Install dependencies
  run: |
    pip install -r requirements-test.txt
    playwright install --with-deps

- name: Run tests
  run: pytest tests/ -v --browser chromium
```

## Writing New Tests

### Basic test structure

```python
import unittest
from playwright.sync_api import sync_playwright, expect


class TestMyFeature(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(headless=False)
    
    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()

    def setUp(self):
        self.page = self.browser.new_page()
    
    def tearDown(self):
        self.page.close()
    
    def test_my_feature(self):
        self.page.goto("http://localhost:3000")
        # Your test code here
        self.assertIn("expected", self.page.url)
```

### Common patterns

```python
# Navigate
self.page.goto("http://localhost:3000/page")

# Find and interact with elements
button = self.page.locator('button[type="submit"]').first
button.click()

input_field = self.page.locator('input[name="email"]').first
input_field.fill("test@example.com")

# Assertions with expect (auto-waiting)
from playwright.sync_api import expect
expect(self.page.locator("#result")).to_be_visible()
expect(self.page.locator(".message")).to_contain_text("Success")

# Traditional assertions
self.assertEqual(self.page.title(), "Expected Title")
self.assertIn("dashboard", self.page.url.lower())
```

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Python API](https://playwright.dev/python/docs/intro)
- [pytest Documentation](https://docs.pytest.org/)
- [pytest-playwright Plugin](https://github.com/microsoft/playwright-pytest)

## Next Steps

1. **Run the tests**: Start with `pytest tests/test_ui.py -v`
2. **Explore traces**: Run `test_advanced.py` and view traces
3. **Write custom tests**: Add tests for your specific features
4. **Integrate with CI/CD**: Add tests to your deployment pipeline

Happy Testing! 🎭
