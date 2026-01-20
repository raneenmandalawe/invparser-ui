"""
User journey tests for the InvParser application.
Tests complete end-to-end user flows.
"""

import os
import unittest
from playwright.sync_api import sync_playwright, expect

from tests.pages.login_page import LoginPage


class TestUserJourney(unittest.TestCase):
    """Test complete user journeys through the application."""
    
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
    
    def tearDown(self):
        """Clean up after each test method."""
        self.page.close()

    def login(self):
        return LoginPage(self.page).load().login("admin", "admin")
    
    def test_login_flow(self):
        """
        Test the complete login flow:
        1. Navigate to home page
        2. Get redirected to login
        3. Enter credentials
        4. Submit form
        5. Land on dashboard
        """
        # Start at home page
        self.page.goto("http://localhost:3000")
        login_page = LoginPage(self.page)
        login_page.assert_loaded()

        dashboard = login_page.login("admin", "admin")
        dashboard.assert_loaded()
        expect(self.page.locator("text=Dashboard").or_(self.page.locator("text=Welcome")).first).to_be_visible(timeout=5000)
    
    def test_login_and_navigate_to_invoices(self):
        """
        Test login followed by navigation to invoices page:
        1. Login
        2. Navigate to invoices
        3. Verify invoices page loads
        """
        dashboard = self.login()
        invoices_page = dashboard.go_to_invoices()
        invoices_page.assert_loaded()
        self.assertIn("invoices", self.page.url.lower())
    
    def test_login_and_upload_navigation(self):
        """
        Test login followed by navigation to upload page:
        1. Login
        2. Navigate to upload
        3. Verify upload page loads
        """
        dashboard = self.login()
        upload_page = dashboard.go_to_upload()
        upload_page.assert_loaded()
        self.assertIn("upload", self.page.url.lower())
    
    def test_logout_flow(self):
        """
        Test the logout flow:
        1. Login
        2. Click logout
        3. Verify redirect to login page
        """
        dashboard = self.login()
        login_page = dashboard.logout()
        login_page.assert_loaded()
        self.assertIn("login", self.page.url.lower())


if __name__ == "__main__":
    unittest.main()
