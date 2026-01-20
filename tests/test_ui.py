"""
Basic UI tests for the InvParser application.
This test suite covers basic page functionality and navigation.
"""

import unittest
from playwright.sync_api import sync_playwright

from tests.pages.login_page import LoginPage


class TestInvParserUI(unittest.TestCase):
    """Basic UI tests for InvParser application."""
    
    @classmethod
    def setUpClass(cls):
        """Set up the browser once for all tests in this class."""
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(headless=False)  # headless=False to see the browser
        
    
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
    
    def test_page_title(self):
        """Test that the page title is correct."""
        self.page.goto("http://localhost:3000")
        title = self.page.title()
        # Accept the full title the app renders
        self.assertIn("InvoiceParser", title)
    
    def test_redirect_to_login(self):
        """Test that unauthenticated users are redirected to login."""
        self.page.goto("http://localhost:3000")
        login_page = LoginPage(self.page)
        login_page.assert_loaded()
        self.assertIn("login", self.page.url.lower())


if __name__ == "__main__":
    unittest.main()
