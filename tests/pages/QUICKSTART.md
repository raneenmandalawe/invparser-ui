# Quick Start Guide - Page Object Model

Welcome to your refactored test suite! Here's how to get started with the Page Object Model pattern.

## 🚀 Quick Start (5 minutes)

### 1. Understanding Page Objects
Each page of your app has a corresponding Python class in `tests/pages/`:
- `LoginPage` - Login page interactions
- `DashboardPage` - Dashboard interactions  
- `InvoicesPage` - Invoices list page
- `UploadPage` - File upload page
- `InvoiceDetailPage` - Individual invoice detail

### 2. Basic Test Structure
```python
from tests.pages.login_page import LoginPage

def test_my_flow(self):
    # Create page object
    login_page = LoginPage(self.page)
    
    # Navigate and interact
    dashboard = login_page.load().login("admin", "admin")
    
    # Continue on new page
    dashboard.assert_loaded()
```

### 3. Common Patterns

#### Pattern 1: Login and Verify
```python
dashboard = LoginPage(self.page).load().login("admin", "admin")
self.assertIn("dashboard", self.page.url.lower())
```

#### Pattern 2: Multi-page Journey
```python
dashboard = LoginPage(self.page).load().login("admin", "admin")
invoices = dashboard.go_to_invoices()
invoices.assert_loaded()
dashboard.logout()
```

#### Pattern 3: Error Testing
```python
LoginPage(self.page).load().login_expect_failure("wrong", "wrong")
self.assertIn("login", self.page.url.lower())
```

#### Pattern 4: File Upload
```python
dashboard = LoginPage(self.page).load().login("admin", "admin")
upload = dashboard.go_to_upload()
upload.upload_file("tests/fixtures/sample.txt")
```

## 📚 Documentation Files

Read these for deep dives:

| File | Purpose |
|------|---------|
| `tests/pages/README.md` | Complete POM reference |
| `tests/pages/EXAMPLES.md` | 10+ code examples |
| `tests/pages/MIGRATION_SUMMARY.md` | What changed |

## 🎯 Key Concepts

### 1. Page Objects Return Page Objects
This enables **page chaining**:
```python
dashboard = LoginPage(self.page).load().login("admin", "admin")
# ↑ LoginPage.load() returns self (LoginPage)
# ↑ LoginPage.login() returns DashboardPage
# ↑ Now we can call DashboardPage methods
```

### 2. Selectors Are Centralized
All selectors for a page are in one place:
```python
class LoginPage:
    username_input = 'input[type="text"]'  # ← All selectors here
    password_input = 'input[type="password"]'
    submit_button = 'button[type="submit"]'
```

**If UI changes:** Update selector in page object, all tests work!

### 3. Methods Represent User Actions
Method names describe what the user does:
```python
login()           # ✓ User logs in
go_to_invoices()  # ✓ User navigates to invoices
logout()          # ✓ User logs out

fill_username()   # ✗ Too technical
click_submit()    # ✗ Too technical
```

## 🏗️ Creating New Page Objects

### Template
```python
from playwright.sync_api import expect
from .base_page import BasePage

class NewPage(BasePage):
    # Define selectors as class attributes
    heading = 'text=Page Title'
    button = 'button[type="submit"]'
    
    def assert_loaded(self):
        """Verify page loaded."""
        self.page.wait_for_url("**/path", timeout=5000)
        expect(self.page.locator(self.heading)).to_be_visible()
        return self
    
    def perform_action(self):
        """User action on page."""
        self.page.locator(self.button).click()
        from .next_page import NextPage
        return NextPage(self.page, self.base_url)
```

### Steps
1. Create `tests/pages/your_page.py`
2. Define selectors as class attributes
3. Implement `assert_loaded()` method
4. Create action methods that return page objects
5. Import in test files

## 🔍 Navigation Map

```
LoginPage
  ├─ load()
  ├─ login() → DashboardPage
  └─ login_expect_failure()

DashboardPage
  ├─ assert_loaded()
  ├─ go_to_invoices() → InvoicesPage
  ├─ go_to_upload() → UploadPage
  ├─ go_to_dashboard()
  └─ logout() → LoginPage

InvoicesPage
  ├─ assert_loaded()
  └─ open_first_invoice() → URL

UploadPage
  ├─ assert_loaded()
  └─ upload_file(path) → UploadPage

InvoiceDetailPage
  ├─ assert_loaded()
  └─ go_back_to_invoices() → InvoicesPage
```

## 💻 Running Tests

```bash
# All tests
pytest tests/

# Specific file
pytest tests/test_components.py

# Specific test
pytest tests/test_user_journey.py::TestUserJourney::test_login_flow

# With verbosity
pytest tests/ -v

# With browser visible (headless=False)
pytest tests/ -v --headed
```

## ❓ FAQ

### Q: When do I create a new page object?
**A:** When the user navigates to a new URL with distinct interactions.
- `/login` → `LoginPage`
- `/dashboard` → `DashboardPage`
- `/invoices` → `InvoicesPage`

### Q: Should page objects have assertions?
**A:** Only `assert_loaded()` to verify page is ready. Business logic assertions stay in tests.

### Q: How do I handle popup/modal?
**A:** Treat as component or small page object. Return appropriate page after dismissing.

### Q: What if a page has many components?
**A:** Create component classes and compose them in the page object.

```python
class DashboardPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.sidebar = SidebarComponent(page)
        self.topbar = TopbarComponent(page)
```

### Q: How do I test different user types?
**A:** Page objects don't care about user type - tests do.

```python
def test_admin_flow(self):
    dashboard = LoginPage(self.page).load().login("admin", "admin123")

def test_user_flow(self):
    dashboard = LoginPage(self.page).load().login("user", "user123")
```

## 🎓 Best Practices Checklist

- [ ] Each page has its own Python class
- [ ] Selectors are class attributes (not hardcoded in methods)
- [ ] Methods have clear, verb-based names
- [ ] Methods return page objects (enable chaining)
- [ ] `assert_loaded()` verifies page ready
- [ ] No business assertions in page objects
- [ ] Test code reads like user journey
- [ ] Selector change only requires editing page object

## 🚨 Common Mistakes to Avoid

### ❌ Wrong: Selector in method
```python
def login(self, user, pwd):
    self.page.locator('input[type="text"]').fill(user)  # ✗ Hardcoded
```

### ✅ Right: Selector as class attribute
```python
class LoginPage:
    username_input = 'input[type="text"]'  # ✓ Centralized
    
    def login(self, user, pwd):
        self.page.locator(self.username_input).fill(user)
```

### ❌ Wrong: Method names too technical
```python
def click_login_button(self):  # ✗ Describes clicking
def fill_username_field(self):  # ✗ Describes filling
```

### ✅ Right: Method names describe user action
```python
def login(self, username, password):  # ✓ Describes action
```

### ❌ Wrong: Assertions in page object
```python
def login(self, user, pwd):
    # ...
    self.assertIn("dashboard", self.page.url)  # ✗ Assertion in PO
```

### ✅ Right: Assertions in test
```python
def login(self, user, pwd):
    # ...
    return DashboardPage(self.page)  # ✓ Return page object

# In test:
dashboard = login_page.login("admin", "admin")
self.assertIn("dashboard", self.page.url)  # ✓ Assertion in test
```

## 🎉 You're Ready!

You now have a professional, maintainable test suite using the Page Object Model pattern!

### Next steps:
1. Read `README.md` for deeper understanding
2. Look at `EXAMPLES.md` for more patterns
3. Run existing tests to see POM in action
4. Add new page objects as you expand tests
5. Update selectors in one place when UI changes

Happy testing! 🚀
