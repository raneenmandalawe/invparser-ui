# Playwright Testing Setup - Summary

## ✅ What Was Created

I've set up a complete Playwright testing suite for your Invoice Parser UI application. Here's what was added:

### Test Files

1. **`tests/test_ui.py`** - Basic UI tests
   - Page title verification
   - Redirect to login for unauthenticated users

2. **`tests/test_user_journey.py`** - End-to-end user journeys
   - Complete login flow
   - Login and navigate to invoices
   - Login and navigate to upload
   - Logout flow

3. **`tests/test_components.py`** - Component-specific tests
   - **TestLoginComponent**: Login form validation, valid/invalid credentials, empty fields
   - **TestNavigationComponent**: Sidebar visibility, navigation links, topbar, logout button
   - **TestUploadComponent**: Upload page, dropzone visibility, file input
   - **TestInvoiceTableComponent**: Table visibility, headers, data rows, row clicks

4. **`tests/test_advanced.py`** - Advanced Playwright features
   - **TestWithTracing**: Records traces for debugging (saves on failure)
   - **TestWithAuthState**: Reuses authentication state (faster tests)
   - **TestWithClock**: Clock manipulation for time-dependent features

### Configuration Files

- **`pytest.ini`** - pytest configuration with markers and options
- **`requirements-test.txt`** - Python dependencies for testing
- **`.gitignore`** - Ignore test artifacts (traces, auth state, etc.)

### Documentation

- **`TESTING.md`** - Comprehensive testing guide covering:
  - Installation instructions
  - How to run tests
  - Test organization
  - Advanced features (tracing, auth state, clock)
  - Troubleshooting
  - Writing new tests

### Scripts

- **`setup-tests.sh`** - Automated setup script (executable)

## 🚀 Quick Start

### 1. Install dependencies

```bash
# Make sure you're in your virtual environment
source .venv/bin/activate

# Run the setup script (easiest way)
./setup-tests.sh

# OR install manually:
pip install -r requirements-test.txt
playwright install
```

### 2. Start your Next.js app

```bash
cd invparser-ui
npm run dev
```

The app should be running at http://localhost:3000

### 3. Run tests

```bash
# Run all tests
pytest tests/ -v

# Run specific test files
pytest tests/test_ui.py -v
pytest tests/test_user_journey.py -v
pytest tests/test_components.py -v
pytest tests/test_advanced.py -v

# Run a specific test
pytest tests/test_user_journey.py::TestUserJourney::test_login_flow -v
```

## 📊 Test Coverage

The test suite covers:

### ✅ Basic Functionality
- Page titles and meta information
- Authentication redirects
- Login/logout flows

### ✅ User Journeys
- Complete login flow (redirect → login → dashboard)
- Navigation between pages (dashboard, upload, invoices)
- Logout and session termination

### ✅ Components
- **Login Component**: Form validation, credentials, error handling
- **Navigation**: Sidebar, topbar, links, user info display
- **Upload**: File dropzone, file input, upload page
- **Invoice Table**: Table structure, data display, row interactions

### ✅ Advanced Features
- **Trace Recording**: Debug failed tests with visual traces
- **Auth State Reuse**: Faster tests by reusing login state
- **Clock Manipulation**: Test time-dependent features

## 🎯 Test Examples

### Basic Test
```python
def test_page_title(self):
    """Test that the page title is correct."""
    self.page.goto("http://localhost:3000")
    title = self.page.title()
    self.assertIn("InvParser", title)
```

### User Journey Test
```python
def test_login_flow(self):
    """Test complete login flow."""
    self.page.goto("http://localhost:3000")
    self.page.wait_for_url("**/login")
    
    # Fill login form
    email_input = self.page.locator('input[type="email"]').first
    password_input = self.page.locator('input[type="password"]').first
    
    email_input.fill("admin")
    password_input.fill("admin")
    
    # Submit
    submit_button = self.page.locator('button[type="submit"]').first
    submit_button.click()
    
    # Verify dashboard
    self.page.wait_for_url("**/dashboard", timeout=5000)
    self.assertIn("dashboard", self.page.url.lower())
```

### Component Test with Expectations
```python
from playwright.sync_api import expect

def test_sidebar_is_visible(self):
    """Test that sidebar is visible on dashboard."""
    sidebar = self.page.locator('nav, aside, [class*="sidebar"]').first
    expect(sidebar).to_be_visible(timeout=5000)
```

## 🔍 Advanced Features

### 1. Trace Viewer

Failed tests automatically save traces to `tests/traces/`. View them with:

```bash
playwright show-trace tests/traces/test_name_trace.zip
```

The trace viewer shows:
- Screenshots at each step
- DOM snapshots (time-travel debugging!)
- Network requests/responses
- Console logs
- Source code

### 2. Authentication State Reuse

Instead of logging in for every test, save auth state once and reuse:

```python
# Login once, save state
context.storage_state(path="playwright/.auth/user.json")

# Reuse in other tests
context = browser.new_context(storage_state="playwright/.auth/user.json")
```

This makes tests much faster! See `test_advanced.py::TestWithAuthState`.

### 3. Clock Manipulation

Control time in your tests:

```python
# Set to specific time
self.page.clock.install(time="2024-01-01T10:00:00")

# Fast forward 30 minutes
self.page.clock.fast_forward(30 * 60 * 1000)
```

Useful for testing session timeouts, date displays, etc.

## 📝 Test Credentials

All tests use these dummy credentials:
- **Username/Email**: `admin`
- **Password**: `admin`

## 🐛 Troubleshooting

### Tests fail with timeout errors
**Solution**: Make sure Next.js app is running on port 3000
```bash
cd invparser-ui && npm run dev
```

### Browser doesn't open
**Solution**: Install browser binaries
```bash
playwright install
```

### Element not found errors
**Possible causes**:
- App still loading (increase timeout)
- Selectors changed (update locators)
- Elements not visible (check CSS)

## 📚 Next Steps

1. **Run the basic tests first**:
   ```bash
   pytest tests/test_ui.py -v
   ```

2. **Try the user journey tests**:
   ```bash
   pytest tests/test_user_journey.py -v
   ```

3. **Explore advanced features**:
   ```bash
   pytest tests/test_advanced.py -v
   playwright show-trace tests/traces/*.zip
   ```

4. **Write your own tests**:
   - Add new test files in `tests/`
   - Follow the patterns in existing tests
   - See `TESTING.md` for detailed guidance

5. **Integrate with CI/CD**:
   - Use headless mode: `headless=True`
   - Run in GitHub Actions or similar
   - Generate HTML reports: `pytest --html=report.html`

## 📖 Resources

- **TESTING.md** - Full testing guide (read this!)
- [Playwright Docs](https://playwright.dev/)
- [Playwright Python API](https://playwright.dev/python/docs/intro)
- [pytest Docs](https://docs.pytest.org/)

## 🎉 What You Can Test Now

With this setup, you can test:

✅ User authentication flows
✅ Page navigation and routing
✅ Form submissions and validation
✅ Table interactions and filtering
✅ File upload functionality
✅ Component visibility and behavior
✅ Time-dependent features
✅ Session management
✅ Error handling

Happy testing! 🎭✨
