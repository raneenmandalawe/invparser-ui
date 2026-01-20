# Page Object Model Implementation - InvParser UI Tests

This document describes the Page Object Model (POM) implementation for the InvParser UI automated tests.

## Overview

The Page Object Model is a design pattern that separates test logic from page-specific details. Instead of scattering selectors throughout test files, page objects encapsulate the UI structure and provide methods that represent user interactions.

**Benefits:**
- Reduced test maintenance when UI changes
- Improved code reusability
- Cleaner, more readable tests
- Better separation of concerns

## Project Structure

```
tests/
├── pages/
│   ├── __init__.py
│   ├── base_page.py              # Base class for all page objects
│   ├── login_page.py             # Login page object
│   ├── dashboard_page.py         # Dashboard page object
│   ├── invoices_page.py          # Invoices list page object
│   ├── upload_page.py            # Upload page object
│   └── invoice_detail_page.py    # Invoice detail page object
├── test_ui.py                     # Basic UI tests
├── test_components.py             # Component tests (using POM)
├── test_user_journey.py          # User journey tests (using POM)
├── test_advanced.py              # Advanced tests (using POM)
└── test_file_upload.py           # File upload tests (using POM)
```

## Page Objects

### BasePage
Base class for all page objects. Provides common functionality for all pages.

```python
class BasePage:
    def __init__(self, page: Page, base_url: str = "http://localhost:3000"):
        self.page = page
        self.base_url = base_url

    def goto(self, path: str):
        self.page.goto(f"{self.base_url}{path}")
        return self

    def expect_url_fragment(self, fragment: str, timeout: int = 5000):
        expect(self.page).to_have_url(f"**/{fragment}*", timeout=timeout)
        return self
```

**Features:**
- Initializes Playwright page and base URL
- Provides navigation helper (`goto()`)
- Provides URL validation helper
- Returns `self` for method chaining

---

### LoginPage

Encapsulates the login page and authentication flow.

```python
class LoginPage(BasePage):
    username_input = 'input[type="text"], input[name="username"], input[placeholder*="user" i]'
    password_input = 'input[type="password"]'
    submit_button = 'button[type="submit"]'
    error_message = 'text=Invalid username or password'

    def load(self):
        """Navigate to login page and verify it loaded."""
        self.goto("/login")
        return self.assert_loaded()

    def assert_loaded(self):
        """Verify login page is properly loaded."""
        # Checks URL and form elements visibility

    def login(self, username: str, password: str) -> DashboardPage:
        """Log in with credentials and return Dashboard page object."""
        # Fills form, clicks submit, waits for dashboard load

    def login_expect_failure(self, username: str, password: str):
        """Attempt login and verify error appears."""
        # Fills form, clicks submit, checks for error message
```

**Key Methods:**
- `load()` - Navigate to login and assert page loaded
- `assert_loaded()` - Verify login page is ready
- `login(username, password)` - Perform login and return DashboardPage
- `login_expect_failure(username, password)` - Test failed login

**Returns DashboardPage** - Enables page chaining

---

### DashboardPage

Encapsulates the dashboard page and its navigation options.

```python
class DashboardPage(BasePage):
    dashboard_heading = 'text=Dashboard'

    def assert_loaded(self):
        """Verify dashboard is loaded."""

    def go_to_invoices(self) -> InvoicesPage:
        """Navigate to invoices page."""

    def go_to_upload(self) -> UploadPage:
        """Navigate to upload page."""

    def go_to_dashboard(self):
        """Navigate back to dashboard."""

    def logout(self) -> LoginPage:
        """Logout and return to login page."""
```

**Key Methods:**
- `assert_loaded()` - Verify dashboard loaded
- `go_to_invoices()` - Navigate to Invoices, return InvoicesPage
- `go_to_upload()` - Navigate to Upload, return UploadPage
- `logout()` - Logout, return LoginPage

**Returns other page objects** - Enables page chaining

---

### InvoicesPage

Encapsulates the invoices list page.

```python
class InvoicesPage(BasePage):
    table_locator = 'table, [role="table"]'
    row_locator = 'tbody tr, [role="row"]'

    def assert_loaded(self):
        """Verify invoices page and table are loaded."""

    def open_first_invoice(self) -> str:
        """Click first invoice row and return URL."""
```

**Key Methods:**
- `assert_loaded()` - Verify page and table loaded
- `open_first_invoice()` - Click first invoice and return URL

---

### UploadPage

Encapsulates the upload page functionality.

```python
class UploadPage(BasePage):
    dropzone = '[class*="dropzone"], input[type="file"], text=Upload'

    def assert_loaded(self):
        """Verify upload page is loaded."""

    def upload_file(self, file_path: str):
        """Upload a file and return self for chaining."""
```

**Key Methods:**
- `assert_loaded()` - Verify page loaded
- `upload_file(file_path)` - Upload file, return self

---

### InvoiceDetailPage

Encapsulates the individual invoice detail page.

```python
class InvoiceDetailPage(BasePage):
    invoice_detail = '[class*="invoice"], text=/Invoice|Details/i'

    def assert_loaded(self):
        """Verify invoice detail page loaded."""

    def go_back_to_invoices(self) -> InvoicesPage:
        """Navigate back to invoices list."""
```

**Key Methods:**
- `assert_loaded()` - Verify page loaded
- `go_back_to_invoices()` - Return to InvoicesPage

---

## Page Chaining

Page objects return other page objects, enabling fluent interfaces that model user journeys:

```python
def test_complete_workflow(self):
    dashboard = LoginPage(self.page)\
        .load()\
        .login("admin", "admin")  # returns DashboardPage
    
    invoices = dashboard.go_to_invoices()  # returns InvoicesPage
    
    first_invoice_url = invoices.open_first_invoice()  # returns str
    
    uploaded_page = dashboard\
        .go_to_upload()\  # returns UploadPage
        .upload_file("tests/fixtures/sample.txt")  # returns UploadPage
    
    login_page = dashboard.logout()  # returns LoginPage
```

## Usage Examples

### Example 1: Basic Login Test

```python
def test_valid_login(self):
    """Test successful login."""
    dashboard = LoginPage(self.page)\
        .load()\
        .login("admin", "admin")
    
    dashboard.assert_loaded()
    self.assertIn("dashboard", self.page.url.lower())
```

**Without POM (before):**
```python
def test_valid_login(self):
    self.page.goto("http://localhost:3000/login")
    user_input = self.page.locator('input[type="text"]').first
    password_input = self.page.locator('input[type="password"]').first
    user_input.fill("admin")
    password_input.fill("admin")
    submit_button = self.page.locator('button[type="submit"]').first
    submit_button.click()
    self.page.wait_for_url("**/dashboard", timeout=5000)
    self.assertIn("dashboard", self.page.url.lower())
```

### Example 2: User Journey Test

```python
def test_upload_and_view_invoice(self):
    """Test uploading file and viewing invoice."""
    # Login
    dashboard = LoginPage(self.page).load().login("admin", "admin")
    
    # Upload file
    upload_page = dashboard.go_to_upload()
    upload_page.upload_file("tests/fixtures/sample_invoice.txt")
    
    # Navigate to invoices
    invoices_page = dashboard.go_to_invoices()
    invoices_page.assert_loaded()
    
    # View first invoice
    url = invoices_page.open_first_invoice()
    self.assertIn("/invoice/", url)
    
    # Logout
    login_page = dashboard.logout()
    login_page.assert_loaded()
```

### Example 3: Failed Login Test

```python
def test_invalid_credentials(self):
    """Test login failure with wrong credentials."""
    LoginPage(self.page)\
        .load()\
        .login_expect_failure("wronguser", "wrongpass")
    
    self.assertIn("login", self.page.url.lower())
```

## Selector Management

All selectors are defined as class attributes in page objects, making them easy to update when UI changes:

```python
class LoginPage(BasePage):
    username_input = 'input[type="text"], input[placeholder*="user" i]'
    password_input = 'input[type="password"]'
    submit_button = 'button[type="submit"]'
```

**When UI changes:** Only modify the selector in the page object. No test files need to change.

## Best Practices

1. **One page object per page** - Each page gets its own class
2. **Selectors as class attributes** - Centralized, easy to update
3. **Methods return page objects** - Enable fluent chaining
4. **Methods represent user actions** - `login()`, `upload_file()`, not `fill_username_field()`
5. **Assertions stay in tests** - Page objects verify page load, tests verify business logic
6. **Self-returns for chaining** - Methods that don't navigate return `self`
7. **Lazy navigation** - Navigate only when necessary
8. **Clear method names** - `go_to_invoices()` not `click_invoices_link()`

## Maintenance Benefits

### Before POM:
```python
# Selector scattered across multiple test files
def test_1(self):
    self.page.locator('input[type="text"]').first.fill("admin")
    self.page.locator('input[type="password"]').first.fill("pass")

def test_2(self):
    self.page.locator('input[type="text"]').first.fill("admin")
    self.page.locator('input[type="password"]').first.fill("pass")

# If selector changes, must update all tests!
```

### After POM:
```python
class LoginPage:
    username_input = 'input[type="text"]'
    password_input = 'input[type="password"]'

# Change selector in one place
# All tests using LoginPage automatically work!
```

## Running Tests with POM

```bash
# Run all tests
python -m pytest tests/ -v

# Run specific test file
python -m pytest tests/test_components.py -v

# Run specific test class
python -m pytest tests/test_user_journey.py::TestUserJourney -v

# Run specific test method
python -m pytest tests/test_user_journey.py::TestUserJourney::test_login_flow -v
```

## Adding New Page Objects

Template for creating a new page object:

```python
from playwright.sync_api import expect
from .base_page import BasePage

class NewPage(BasePage):
    # Define selectors as class attributes
    heading = 'text=Page Title'
    submit_button = 'button[type="submit"]'
    
    def assert_loaded(self):
        """Verify page loaded."""
        self.page.wait_for_url("**/path", timeout=5000)
        expect(self.page.locator(self.heading).first).to_be_visible()
        return self
    
    def perform_action(self):
        """Perform an action on the page."""
        self.page.locator(self.submit_button).first.click()
        return self  # or return other_page_object
```

## Summary

The Page Object Model implementation provides:
- ✅ Cleaner, more readable tests
- ✅ Centralized selector management
- ✅ Easy maintenance when UI changes
- ✅ Reusable page interaction methods
- ✅ Fluent interface via page chaining
- ✅ Separation of concerns (test logic vs. UI details)
- ✅ Scalable architecture for growing test suites
