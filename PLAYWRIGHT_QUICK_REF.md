# Playwright Quick Reference

## Installation

```bash
# Option 1: Run setup script
./setup-tests.sh

# Option 2: Manual installation
pip install -r requirements-test.txt
playwright install
```

## Running Tests

```bash
# All tests
pytest tests/ -v

# Specific file
pytest tests/test_ui.py -v
pytest tests/test_user_journey.py -v
pytest tests/test_components.py -v
pytest tests/test_advanced.py -v

# Specific test
pytest tests/test_user_journey.py::TestUserJourney::test_login_flow -v

# With different browsers
pytest tests/ --browser firefox
pytest tests/ --browser webkit
```

## Common Playwright Patterns

### Navigation
```python
self.page.goto("http://localhost:3000/page")
self.page.wait_for_url("**/dashboard", timeout=5000)
```

### Finding Elements
```python
# By selector
element = self.page.locator('button[type="submit"]').first
element = self.page.locator('#id')
element = self.page.locator('.class-name')

# By text
element = self.page.locator('text="Submit"')
element = self.page.locator('text=/login|signup/i')  # regex

# By role
element = self.page.get_by_role("button", name="Submit")
```

### Actions
```python
element.click()
element.fill("text")
element.check()  # checkbox
element.select_option("value")
element.hover()
```

### Assertions

#### Playwright expect (auto-waiting)
```python
from playwright.sync_api import expect

expect(page).to_have_title("Title")
expect(page).to_have_url("http://...")
expect(locator).to_be_visible()
expect(locator).to_contain_text("text")
expect(locator).to_have_value("value")
expect(locator).to_be_enabled()
```

#### Traditional unittest
```python
self.assertEqual(page.title(), "Title")
self.assertIn("text", page.url)
self.assertTrue(locator.is_visible())
```

## Test Structure

```python
import unittest
from playwright.sync_api import sync_playwright, expect


class TestMyFeature(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        """Run once before all tests."""
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(headless=False)
    
    @classmethod
    def tearDownClass(cls):
        """Run once after all tests."""
        cls.browser.close()
        cls.playwright.stop()

    def setUp(self):
        """Run before each test."""
        self.page = self.browser.new_page()
    
    def tearDown(self):
        """Run after each test."""
        self.page.close()
    
    def test_something(self):
        """Test description."""
        self.page.goto("http://localhost:3000")
        # Test code here
```

## Advanced Features

### Tracing
```python
def setUp(self):
    self.context = self.browser.new_context()
    self.context.tracing.start(screenshots=True, snapshots=True)
    self.page = self.context.new_page()

def tearDown(self):
    if test_failed:
        self.context.tracing.stop(path="traces/trace.zip")
    else:
        self.context.tracing.stop()
    self.context.close()

# View trace
# playwright show-trace traces/trace.zip
```

### Authentication State
```python
# Save auth state
context.storage_state(path="playwright/.auth/user.json")

# Load auth state
context = browser.new_context(storage_state="playwright/.auth/user.json")
```

### Clock Manipulation
```python
# Set time
page.clock.install(time="2024-01-01T10:00:00")

# Fast forward
page.clock.fast_forward(30 * 60 * 1000)  # 30 minutes in ms
```

## Debugging

### Show browser (non-headless)
```python
browser = playwright.chromium.launch(headless=False)
```

### Slow down actions
```python
browser = playwright.chromium.launch(slow_mo=1000)  # 1 second delay
```

### Page pause (interactive debugging)
```python
page.pause()  # Opens Playwright Inspector
```

### Screenshots
```python
page.screenshot(path="screenshot.png")
page.screenshot(path="full.png", full_page=True)
```

## File Upload
```python
# Set file
file_input = page.locator('input[type="file"]')
file_input.set_input_files("path/to/file.pdf")

# Multiple files
file_input.set_input_files(["file1.pdf", "file2.pdf"])
```

## Waiting

### Wait for URL
```python
page.wait_for_url("**/dashboard", timeout=5000)
```

### Wait for selector
```python
page.wait_for_selector("#element", timeout=5000)
```

### Wait for timeout
```python
page.wait_for_timeout(1000)  # 1 second
```

### Wait for load state
```python
page.wait_for_load_state("networkidle")
```

## Test Credentials

- **Username**: `admin`
- **Password**: `admin`

## Common Issues

### "Element not found"
- Increase timeout: `timeout=10000`
- Check selector: use `.first` for multiple matches
- Wait for element: `page.wait_for_selector()`

### "Page timeout"
- Ensure app is running: `npm run dev`
- Increase timeout in wait methods
- Check network tab in trace viewer

### Browser doesn't open
- Install browsers: `playwright install`
- Check headless setting: `headless=False` to see browser

## Resources

- Full guide: `TESTING.md`
- Setup summary: `PLAYWRIGHT_SETUP.md`
- Playwright docs: https://playwright.dev/
