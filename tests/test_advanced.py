"""
Advanced Playwright tests demonstrating tracing, authentication state, and clock manipulation.
"""

import os
import unittest
from playwright.sync_api import sync_playwright, expect

from tests.pages.login_page import LoginPage

HEADLESS = os.getenv('HEADLESS', 'false').lower() == 'true'


class TestWithTracing(unittest.TestCase):
    """Tests that demonstrate trace recording for debugging."""
    
    @classmethod
    def setUpClass(cls):
        """Set up the browser once for all tests in this class."""
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(headless=HEADLESS)
        
        # Ensure traces directory exists
        os.makedirs("tests/traces", exist_ok=True)
    
    @classmethod
    def tearDownClass(cls):
        """Clean up after all tests are done."""
        cls.browser.close()
        cls.playwright.stop()

    def setUp(self):
        """Set up before each test method."""
        self.context = self.browser.new_context()
        # Start tracing before creating the page
        self.context.tracing.start(screenshots=True, snapshots=True, sources=True)
        self.page = self.context.new_page()
    
    def tearDown(self):
        """Clean up after each test method."""
        # Only save trace if test failed
        if hasattr(self._outcome, 'errors') and self._outcome.errors:
            # Test failed, save the trace
            trace_path = f"tests/traces/{self._testMethodName}_trace.zip"
            self.context.tracing.stop(path=trace_path)
            print(f"\n⚠️  Test failed! Trace saved to: {trace_path}")
            print(f"View it with: playwright show-trace {trace_path}")
        else:
            # Test passed, discard the trace
            self.context.tracing.stop()
        
        self.context.close()
    
    def test_login_with_tracing(self):
        """Test login flow with trace recording (will save trace if test fails)."""
        dashboard = LoginPage(self.page).load().login("admin", "admin")
        dashboard.assert_loaded()
        self.assertIn("dashboard", self.page.url.lower())
    
    def test_navigation_with_tracing(self):
        """Test navigation with trace recording."""
        dashboard = LoginPage(self.page).load().login("admin", "admin")
        upload_page = dashboard.go_to_upload()
        upload_page.assert_loaded()
        self.assertIn("upload", self.page.url.lower())


class TestWithAuthState(unittest.TestCase):
    """Tests that demonstrate reusing authentication state across tests."""
    
    AUTH_FILE = "playwright/.auth/user.json"
    
    @classmethod
    def setUpClass(cls):
        """Set up the browser once for all tests in this class."""
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(headless=False)
        
        # Create auth directory if it doesn't exist
        os.makedirs("playwright/.auth", exist_ok=True)
        
        # Perform authentication once and save state
        cls._perform_authentication()
    
    @classmethod
    def _perform_authentication(cls):
        """Log in once and save the authentication state."""
        context = cls.browser.new_context()
        page = context.new_page()
        
        LoginPage(page).load().login("admin", "admin")
        
        # Save authentication state
        context.storage_state(path=cls.AUTH_FILE)
        print(f"\n✓ Authentication state saved to: {cls.AUTH_FILE}")
        
        context.close()
    
    @classmethod
    def tearDownClass(cls):
        """Clean up after all tests are done."""
        cls.browser.close()
        cls.playwright.stop()

    def setUp(self):
        """Set up before each test method."""
        # Create a new context with saved authentication state
        self.context = self.browser.new_context(storage_state=self.AUTH_FILE)
        self.page = self.context.new_page()
    
    def tearDown(self):
        """Clean up after each test method."""
        self.context.close()
    
    def test_access_dashboard_with_saved_auth(self):
        """Test accessing dashboard without logging in (using saved auth state)."""
        # No need to log in - already authenticated!
        self.page.goto("http://localhost:3000/dashboard")
        
        # Should already be on dashboard
        self.assertIn("dashboard", self.page.url.lower())
        
        # Verify we're authenticated by checking for user-specific content
        welcome_msg = self.page.locator('text=/Welcome|admin/i')
        expect(welcome_msg.first).to_be_visible(timeout=5000)
    
    def test_access_invoices_with_saved_auth(self):
        """Test accessing invoices page without logging in (using saved auth state)."""
        # No need to log in - already authenticated!
        self.page.goto("http://localhost:3000/invoices")
        
        # Should be on invoices page without redirect
        self.page.wait_for_timeout(1000)
        self.assertIn("invoices", self.page.url.lower())
        
        # Verify page loaded
        table = self.page.locator('table, [role="table"]')
        expect(table.first).to_be_visible(timeout=5000)
    
    def test_access_upload_with_saved_auth(self):
        """Test accessing upload page without logging in (using saved auth state)."""
        # No need to log in - already authenticated!
        self.page.goto("http://localhost:3000/upload")
        
        # Should be on upload page without redirect
        self.page.wait_for_timeout(1000)
        self.assertIn("upload", self.page.url.lower())
        
        # Verify upload zone exists
        upload_zone = self.page.locator('[class*="dropzone"], input[type="file"]')
        self.assertGreater(upload_zone.count(), 0)


class TestWithClock(unittest.TestCase):
    """Tests that demonstrate clock manipulation for time-dependent features."""
    
    @classmethod
    def setUpClass(cls):
        """Set up the browser once for all tests in this class."""
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(headless=False)
    
    @classmethod
    def tearDownClass(cls):
        """Clean up after all tests are done."""
        cls.browser.close()
        cls.playwright.stop()

    def setUp(self):
        """Set up before each test method."""
        self.context = self.browser.new_context()
        self.page = self.context.new_page()
    
    def tearDown(self):
        """Clean up after each test method."""
        self.context.close()
    
    def test_clock_manipulation_example(self):
        """
        Example test demonstrating clock manipulation.
        This is a demonstration - actual time-dependent features would need to exist in the app.
        """
        # Set the browser clock to a specific time
        self.page.clock.install(time="2024-01-01T10:00:00")
        
        LoginPage(self.page).load().login("admin", "admin")
        
        # Fast forward 30 minutes (example of time manipulation)
        self.page.clock.fast_forward(30 * 60 * 1000)
        
        # In a real scenario, you would check for time-dependent UI changes
        # For example: session timeout warnings, time-based notifications, etc.
        
        # This test just demonstrates the API - actual assertions would depend
        # on time-dependent features in your application
        self.assertIn("dashboard", self.page.url.lower())
    
    def test_date_display_with_clock(self):
        """
        Example test for date display features.
        If your app displays dates, you can control what date is shown.
        """
        # Set to a specific date
        self.page.clock.install(time="2026-12-25T12:00:00")
        
        LoginPage(self.page).load().login("admin", "admin")
        
        # Navigate to invoices to see dates
        self.page.goto("http://localhost:3000/invoices")
        self.page.wait_for_timeout(1000)
        
        # In a real scenario, you would verify that dates are displayed correctly
        # based on the clock you set
        self.assertIn("invoices", self.page.url.lower())


if __name__ == "__main__":
    unittest.main()
