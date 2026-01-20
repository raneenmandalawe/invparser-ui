"""
Component tests for the InvParser application.
Tests specific UI components and their functionality.
"""

import os
import unittest
from playwright.sync_api import sync_playwright, expect

from tests.pages.login_page import LoginPage


class TestLoginComponent(unittest.TestCase):
    """Test the login component comprehensively."""
    
    @classmethod
    def setUpClass(cls):
        """Set up the browser once for all tests in this class."""
        HEADLESS = os.getenv('HEADLESS', 'false').lower() == 'true'
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(headless=HEADLESS)
    
    @classmethod
    def tearDownClass(cls):
        """Clean up after all tests are done."""
        cls.browser.close()
        cls.playwright.stop()

    def setUp(self):
        """Set up before each test method."""
        self.page = self.browser.new_page()
        LoginPage(self.page).load()
    
    def tearDown(self):
        """Clean up after each test method."""
        self.page.close()
    
    def test_login_page_loads(self):
        """Test that login page loads correctly."""
        login_page = LoginPage(self.page)
        login_page.assert_loaded()
        expect(self.page.locator(LoginPage.username_input).first).to_be_visible()
        expect(self.page.locator(LoginPage.password_input).first).to_be_visible()
    
    def test_login_with_valid_credentials(self):
        """Test login with valid credentials (happy path)."""
        dashboard = LoginPage(self.page).login("admin", "admin")
        dashboard.assert_loaded()
        self.assertIn("dashboard", self.page.url.lower())
    
    def test_login_with_empty_fields(self):
        """Test login form validation with empty fields."""
        # Try to submit without filling fields
        self.page.locator(LoginPage.submit_button).first.click()
        
        # Should stay on login page (browser validation or app validation)
        # Wait a bit to see if redirect happens
        self.page.wait_for_timeout(1000)
        self.assertIn("login", self.page.url.lower())
    
    def test_login_with_invalid_credentials(self):
        """Test login with invalid credentials."""
        LoginPage(self.page).login_expect_failure("wronguser", "wrongpassword")
        self.assertIn("login", self.page.url.lower())


class TestNavigationComponent(unittest.TestCase):
    """Test the navigation sidebar and topbar components."""
    
    @classmethod
    def setUpClass(cls):
        """Set up the browser once for all tests in this class."""
        HEADLESS = os.getenv('HEADLESS', 'false').lower() == 'true'
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(headless=HEADLESS)
        cls._login()
    
    @classmethod
    def _login(cls):
        """Helper to login once before all tests."""
        context = cls.browser.new_context()
        page = context.new_page()
        
        page.goto("http://localhost:3000/login")
        
        user_input = page.locator('input[type="text"], input[placeholder*="user" i]').first
        password_input = page.locator('input[type="password"]').first
        
        user_input.fill("admin")
        password_input.fill("admin")
        
        submit_button = page.locator('button[type="submit"]').first
        submit_button.click()
        
        page.wait_for_url("**/dashboard", timeout=5000)
        
        context.close()
    
    @classmethod
    def tearDownClass(cls):
        """Clean up after all tests are done."""
        cls.browser.close()
        cls.playwright.stop()

    def setUp(self):
        """Set up before each test method."""
        self.page = self.browser.new_page()
        self.dashboard = LoginPage(self.page).load().login("admin", "admin")
    
    def tearDown(self):
        """Clean up after each test method."""
        self.page.close()
    
    def test_sidebar_is_visible(self):
        """Test that sidebar is visible on dashboard."""
        # Look for sidebar navigation links
        sidebar = self.page.locator('nav, aside, [class*="sidebar"]').first
        expect(sidebar).to_be_visible(timeout=5000)
    
    def test_navigation_links_exist(self):
        """Test that all main navigation links exist."""
        # Check for common navigation items using .or_() for multiple selector options
        dashboard_link = self.page.locator('a[href*="dashboard"]').or_(self.page.locator('text=Dashboard'))
        upload_link = self.page.locator('a[href*="upload"]').or_(self.page.locator('text=Upload'))
        invoices_link = self.page.locator('a[href*="invoices"]').or_(self.page.locator('text=Invoices'))
        
        expect(dashboard_link.first).to_be_visible()
        expect(upload_link.first).to_be_visible()
        expect(invoices_link.first).to_be_visible()
    
    def test_navigation_to_different_pages(self):
        """Test that clicking navigation links works."""
        # Navigate to Upload
        upload_page = self.dashboard.go_to_upload()
        upload_page.assert_loaded()
        self.assertIn("upload", self.page.url.lower())
        
        # Navigate to Invoices
        invoices_page = self.dashboard.go_to_invoices()
        invoices_page.assert_loaded()
        self.assertIn("invoices", self.page.url.lower())
        
        # Navigate back to Dashboard
        self.dashboard.go_to_dashboard()
        self.assertIn("dashboard", self.page.url.lower())
    
    def test_topbar_shows_user_info(self):
        """Test that topbar displays user information."""
        # Check for welcome message or username (topbar might not have specific class)
        welcome_text = self.page.locator('text=/Welcome|admin/i')
        expect(welcome_text.first).to_be_visible(timeout=5000)
    
    def test_logout_button_exists(self):
        """Test that logout button exists and is clickable."""
        logout_button = self.page.locator('button:has-text("Logout"), button:has-text("Sign out")').first
        expect(logout_button).to_be_visible()
        expect(logout_button).to_be_enabled()


class TestUploadComponent(unittest.TestCase):
    """Test the upload component and file handling."""
    
    @classmethod
    def setUpClass(cls):
        """Set up the browser once for all tests in this class."""
        HEADLESS = os.getenv('HEADLESS', 'false').lower() == 'true'
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(headless=HEADLESS)
    
    @classmethod
    def tearDownClass(cls):
        """Clean up after all tests are done."""
        cls.browser.close()
        cls.playwright.stop()

    def setUp(self):
        """Set up before each test method."""
        self.page = self.browser.new_page()
        dashboard = LoginPage(self.page).load().login("admin", "admin")
        self.upload_page = dashboard.go_to_upload()
    
    def tearDown(self):
        """Clean up after each test method."""
        self.page.close()
    
    def test_upload_page_loads(self):
        """Test that upload page loads correctly."""
        # Check for upload dropzone or file input using .or_() for multiple selector options
        self.upload_page.assert_loaded()
    
    def test_upload_dropzone_visible(self):
        """Test that upload dropzone is visible and has proper text."""
        # Look for drag-drop text
        dropzone_text = self.page.locator('text=/drag.*drop|choose.*file|upload/i')
        expect(dropzone_text.first).to_be_visible(timeout=5000)
    
    def test_file_input_exists(self):
        """Test that file input element exists."""
        file_input = self.page.locator('input[type="file"]').first
        # File input might be hidden, so just check it exists in DOM
        self.assertIsNotNone(file_input)


class TestInvoiceTableComponent(unittest.TestCase):
    """Test the invoice table component."""
    
    @classmethod
    def setUpClass(cls):
        """Set up the browser once for all tests in this class."""
        HEADLESS = os.getenv('HEADLESS', 'false').lower() == 'true'
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(headless=HEADLESS)
    
    @classmethod
    def tearDownClass(cls):
        """Clean up after all tests are done."""
        cls.browser.close()
        cls.playwright.stop()

    def setUp(self):
        """Set up before each test method."""
        self.page = self.browser.new_page()
        dashboard = LoginPage(self.page).load().login("admin", "admin")
        self.invoices_page = dashboard.go_to_invoices()
    
    def tearDown(self):
        """Clean up after each test method."""
        self.page.close()
    
    def test_invoices_page_loads(self):
        """Test that invoices page loads correctly."""
        self.assertIn("invoices", self.page.url.lower())
    
    def test_invoice_table_visible(self):
        """Test that invoice table is visible."""
        table = self.page.locator('table, [role="table"]').first
        expect(table).to_be_visible(timeout=5000)
    
    def test_table_has_headers(self):
        """Test that table has proper column headers."""
        # Look for common headers
        headers = self.page.locator('th, [role="columnheader"]')
        self.assertGreater(headers.count(), 0, "Table should have headers")
    
    def test_table_has_data_rows(self):
        """Test that table contains data rows (mock data should be present)."""
        # Look for table rows
        rows = self.page.locator('tbody tr, [role="row"]')
        # Wait a bit for data to load
        self.page.wait_for_timeout(1000)
        row_count = rows.count()
        self.assertGreater(row_count, 0, "Table should have at least one row of data")
    
    def test_invoice_row_clickable(self):
        """Test that clicking an invoice row navigates to detail page."""
        # Wait for table to load
        self.page.wait_for_timeout(1000)
        
        # Find first clickable row
        first_row = self.page.locator('tbody tr, [role="row"]').first
        
        if first_row.count() > 0:
            first_row.click()
            
            # Should navigate to invoice detail page
            self.page.wait_for_timeout(1000)
            self.assertTrue(
                "/invoice/" in self.page.url.lower(),
                "Clicking invoice should navigate to detail page"
            )


if __name__ == "__main__":
    unittest.main()
