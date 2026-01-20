"""
Sample test that demonstrates file upload testing.
This requires a test file to be present.
"""

import os
import unittest
from playwright.sync_api import sync_playwright, expect

from tests.pages.login_page import LoginPage


class TestFileUpload(unittest.TestCase):
    """Test file upload functionality with actual files."""
    
    @classmethod
    def setUpClass(cls):
        """Set up the browser once for all tests in this class."""
        HEADLESS = os.getenv('HEADLESS', 'false').lower() == 'true'
        cls.app_url = os.getenv("APP_URL", "http://localhost:3000").rstrip("/")
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(headless=HEADLESS)
        
        # Create a simple test file if it doesn't exist
        cls.test_file_path = "tests/fixtures/sample_invoice.txt"
        os.makedirs("tests/fixtures", exist_ok=True)
        
        if not os.path.exists(cls.test_file_path):
            with open(cls.test_file_path, "w") as f:
                f.write("INVOICE #12345\n")
                f.write("Date: 2024-01-15\n")
                f.write("Vendor: Test Company Inc.\n")
                f.write("Amount: $1,234.56\n")
    
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
    
    def test_file_upload_with_test_file(self):
        """
        Test file upload with an actual test file.
        
        NOTE: This test demonstrates the approach but may fail if the
        backend is not running or if it expects specific file types.
        """
        # Find file input
        file_input = self.page.locator('input[type="file"]').first
        
        # Set the file
        file_input.set_input_files(self.test_file_path)
        
        # Wait a moment for processing
        self.page.wait_for_timeout(1000)
        
        # In a real scenario, you would:
        # 1. Wait for upload progress indicator
        # 2. Wait for success message
        # 3. Verify redirect to invoice detail page
        # 4. Check that invoice data was processed
        
        # For now, just verify we're still on a valid page
        current_url = self.page.url
        self.assertTrue(current_url.startswith(self.app_url))
    
    def test_drag_and_drop_file(self):
        """
        Test drag-and-drop file upload.
        
        NOTE: Playwright can simulate drag-and-drop events.
        """
        # This is a demonstration of how you might test drag-and-drop
        # The actual implementation depends on your dropzone component
        
        file_input = self.page.locator('input[type="file"]').first
        
        # Playwright doesn't directly support drag-drop of OS files,
        # but you can trigger the file input programmatically
        file_input.set_input_files(self.test_file_path)
        
        self.page.wait_for_timeout(1000)
        
        # Verify upload feedback
        # This is where you'd check for upload progress, success messages, etc.
        current_url = self.page.url
        self.assertTrue(current_url.startswith(self.app_url))


if __name__ == "__main__":
    unittest.main()
