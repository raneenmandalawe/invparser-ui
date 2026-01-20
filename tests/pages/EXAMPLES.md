"""
Comprehensive example demonstrating the Page Object Model (POM) pattern.
This file shows best practices and various usage scenarios.
"""

import unittest
from playwright.sync_api import sync_playwright

from tests.pages.login_page import LoginPage
from tests.pages.dashboard_page import DashboardPage


class PageObjectModelExamples(unittest.TestCase):
    """Examples of using the Page Object Model pattern."""
    
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
    
    # ========== BASIC POM USAGE ==========
    
    def test_1_simple_login_flow(self):
        """
        Example 1: Simple login flow using page objects.
        
        Benefits:
        - Selectors not visible in test code
        - Page load assertions happen automatically
        - Clear, readable test logic
        """
        # Create login page object and load it
        login_page = LoginPage(self.page).load()
        
        # Perform login - returns DashboardPage
        dashboard = login_page.login("admin", "admin")
        
        # Verify we're on dashboard
        self.assertIn("dashboard", self.page.url.lower())
    
    def test_2_fluent_interface_chaining(self):
        """
        Example 2: Using fluent interface for method chaining.
        
        Pattern: LoginPage -> DashboardPage
        
        Benefits:
        - Models user's journey through the app
        - Reduces code repetition
        - Reads like a narrative
        """
        dashboard = LoginPage(self.page)\
            .load()\
            .login("admin", "admin")
        
        dashboard.assert_loaded()
        self.assertIn("dashboard", self.page.url.lower())
    
    def test_3_navigation_through_app(self):
        """
        Example 3: Navigating through multiple pages using POM.
        
        Journey: Login -> Dashboard -> Upload -> Dashboard -> Invoices
        
        Benefits:
        - Each page object handles its own selectors
        - Navigation methods are clearly named
        - Easy to follow the user's workflow
        """
        # Login
        dashboard = LoginPage(self.page).load().login("admin", "admin")
        
        # Navigate to upload
        upload_page = dashboard.go_to_upload()
        upload_page.assert_loaded()
        self.assertIn("upload", self.page.url.lower())
        
        # Go back and navigate to invoices
        dashboard.go_to_dashboard()
        invoices_page = dashboard.go_to_invoices()
        invoices_page.assert_loaded()
        self.assertIn("invoices", self.page.url.lower())
    
    # ========== ADVANCED POM USAGE ==========
    
    def test_4_reusing_page_objects(self):
        """
        Example 4: Reusing page objects in different tests.
        
        Without POM: Would repeat login code in every test
        With POM: Create login page object and use it consistently
        
        Benefits:
        - Single source of truth for page interactions
        - Changes to UI only require updates in one place
        """
        login_page = LoginPage(self.page).load()
        
        # Test 1: Valid login
        dashboard = login_page.login("admin", "admin")
        self.assertIn("dashboard", self.page.url.lower())
    
    def test_5_error_handling_with_pom(self):
        """
        Example 5: Using POM methods for error scenarios.
        
        Benefits:
        - Page object provides method for expected failure
        - Error verification logic centralized in page object
        """
        login_page = LoginPage(self.page).load()
        
        # Test invalid credentials
        login_page.login_expect_failure("wronguser", "wrongpass")
        
        # Verify still on login page
        self.assertIn("login", self.page.url.lower())
    
    def test_6_logout_flow(self):
        """
        Example 6: Testing logout using page chaining.
        
        Journey: Login -> Dashboard -> Logout -> Login
        
        Benefits:
        - logout() returns LoginPage object
        - Can continue operations on returned page
        """
        # Login
        dashboard = LoginPage(self.page).load().login("admin", "admin")
        dashboard.assert_loaded()
        
        # Logout - returns LoginPage
        login_page = dashboard.logout()
        login_page.assert_loaded()
        
        # Verify back at login
        self.assertIn("login", self.page.url.lower())
    
    def test_7_file_upload_workflow(self):
        """
        Example 7: Complex workflow with file upload.
        
        Journey: Login -> Dashboard -> Upload -> Upload File -> Dashboard
        
        Benefits:
        - Each page object encapsulates its specific behavior
        - upload_file() could do complex waiting/verification internally
        """
        dashboard = LoginPage(self.page).load().login("admin", "admin")
        
        # Navigate to upload
        upload_page = dashboard.go_to_upload()
        
        # Upload a file
        test_file = "tests/fixtures/sample_invoice.txt"
        upload_page.upload_file(test_file)
        
        # Could add more assertions here
        self.page.wait_for_timeout(1000)
    
    def test_8_comparing_with_without_pom(self):
        """
        Example 8: Comparing code with and without POM.
        
        This shows why POM is beneficial for maintainability.
        
        ----
        WITHOUT POM (hard to maintain):
        ----
        self.page.goto("http://localhost:3000/login")
        self.page.locator('input[type="text"]').first.fill("admin")
        self.page.locator('input[type="password"]').first.fill("admin")
        self.page.locator('button[type="submit"]').first.click()
        self.page.wait_for_url("**/dashboard")
        
        ----
        WITH POM (easy to maintain):
        ----
        dashboard = LoginPage(self.page).load().login("admin", "admin")
        
        Benefits if login form changes:
        - Without POM: Must update all tests using these selectors
        - With POM: Update only LoginPage class
        """
        # Using POM - clean and maintainable
        dashboard = LoginPage(self.page).load().login("admin", "admin")
        dashboard.assert_loaded()
        self.assertIn("dashboard", self.page.url.lower())
    
    # ========== SELECTOR CENTRALIZATION ==========
    
    def test_9_understanding_selector_management(self):
        """
        Example 9: How selectors are managed in POM.
        
        Each page object defines its selectors as class attributes:
        
        class LoginPage(BasePage):
            username_input = 'input[type="text"], ...'
            password_input = 'input[type="password"]'
            submit_button = 'button[type="submit"]'
        
        When UI changes:
        - Update selector in LoginPage class
        - All tests automatically use new selector
        - No test code changes needed!
        
        This is the PRIMARY benefit of POM.
        """
        # All selectors are centralized in page object classes
        # If you need to verify the selector, it's in LoginPage.username_input
        
        login_page = LoginPage(self.page)
        
        # The selector is LoginPage.username_input
        # If it changes, you update it in ONE place
        self.assertEqual(
            login_page.username_input,
            'input[type="text"], input[name="username"], input[placeholder*="user" i]'
        )
    
    # ========== COMPOSITION ==========
    
    def test_10_page_object_composition(self):
        """
        Example 10: Page objects can be composed for complex pages.
        
        If DashboardPage had multiple components (topbar, sidebar, content),
        you could create separate component objects and compose them:
        
        class DashboardPage(BasePage):
            def __init__(self, page):
                super().__init__(page)
                self.topbar = TopbarComponent(page)
                self.sidebar = SidebarComponent(page)
        
        Then use them like:
        dashboard.topbar.get_username()
        dashboard.sidebar.click_invoices_link()
        
        Benefits:
        - Even better organization for complex pages
        - Component logic stays in component classes
        - Page object orchestrates components
        """
        dashboard = LoginPage(self.page).load().login("admin", "admin")
        
        # In the future, you could use composed components:
        # topbar_user = dashboard.topbar.get_username()
        # dashboard.sidebar.navigate_to_invoices()
        
        dashboard.assert_loaded()


# ========== KEY PRINCIPLES OF POM ==========
"""
1. PAGE = OBJECT
   - Each page of your app gets its own class
   - The class represents that page's interface

2. SELECTORS = CLASS ATTRIBUTES
   - All selectors are defined at class level
   - Easy to find and update
   - Centralized location

3. METHODS = USER INTERACTIONS
   - Methods represent what users can DO
   - login() not fill_username()
   - upload_file() not click_file_input()

4. RETURN PAGE OBJECTS
   - Methods return other page objects when navigating
   - Enables fluent interface
   - Models user journey through app

5. NO ASSERTIONS IN PAGE OBJECTS
   - Page objects verify page loaded (assert_loaded)
   - Tests perform business assertions
   - Clear separation of concerns

6. SELF-RETURNS FOR CHAINING
   - Methods that don't navigate return self
   - Enables continued chaining on same page
   - Makes code more readable

Example:
    upload_page\
        .upload_file("file1.txt")\  # returns UploadPage (self)
        .upload_file("file2.txt")\  # returns UploadPage (self)
        .submit()  # returns DashboardPage
"""

# ========== WHEN TO CREATE NEW PAGE OBJECTS ==========
"""
Create a new page object when:
- User navigates to a new URL path
- Page has distinct section/component
- Page has its own set of interactions

Examples:
- /login -> LoginPage
- /dashboard -> DashboardPage
- /invoices -> InvoicesPage
- /invoice/123 -> InvoiceDetailPage
- /upload -> UploadPage
"""

# ========== BEST PRACTICES ==========
"""
1. One test file imports and uses page objects
   from tests.pages.login_page import LoginPage
   
2. Tests focus on WHAT, not HOW
   dashboard = LoginPage(self.page).load().login("admin", "admin")
   (not: click field X, fill field Y, click button Z)
   
3. Page objects focus on HOW (interactions)
   def login(self, username, password) -> DashboardPage:
       # Here we click fields, fill forms, etc.
       
4. Use descriptive method names
   go_to_invoices() ✓  (better)
   click_invoices_link() ✓  (ok)
   nav_inv() ✗  (too cryptic)
   
5. Page assert methods verify page load
   def assert_loaded(self):
       expect(self.page.locator(self.heading)).to_be_visible()
       
6. Keep methods focused and single-purpose
   login() should ONLY handle login
   Don't do: login_and_navigate_to_invoices()
   Instead: login() then go_to_invoices()
"""


if __name__ == "__main__":
    unittest.main()
