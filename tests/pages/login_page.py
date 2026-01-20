from playwright.sync_api import expect

from .base_page import BasePage


class LoginPage(BasePage):
    username_input = 'input[type="text"], input[name="username"], input[placeholder*="user" i]'
    password_input = 'input[type="password"]'
    submit_button = 'button[type="submit"]'
    error_message = 'text=Invalid username or password'

    def load(self):
        self.goto("/login")
        return self.assert_loaded()

    def assert_loaded(self):
        self.page.wait_for_url("**/login", timeout=5000)
        expect(self.page.locator(self.username_input).first).to_be_visible()
        expect(self.page.locator(self.password_input).first).to_be_visible()
        return self

    def login(self, username: str, password: str):
        self.page.locator(self.username_input).first.fill(username)
        self.page.locator(self.password_input).first.fill(password)
        self.page.locator(self.submit_button).first.click()
        
        from .dashboard_page import DashboardPage
        dashboard = DashboardPage(self.page, self.base_url)
        dashboard.assert_loaded()
        return dashboard

    def login_expect_failure(self, username: str, password: str):
        self.page.locator(self.username_input).first.fill(username)
        self.page.locator(self.password_input).first.fill(password)
        self.page.locator(self.submit_button).first.click()
        expect(self.page.locator(self.error_message).first).to_be_visible(timeout=2000)
        return self
