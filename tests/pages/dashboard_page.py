from playwright.sync_api import expect

from .base_page import BasePage


class DashboardPage(BasePage):
    dashboard_heading = 'text=Dashboard'

    def assert_loaded(self):
        self.page.wait_for_url("**/dashboard", timeout=5000)
        # Use .first to handle strict mode when multiple elements match
        welcome_element = self.page.locator(self.dashboard_heading).or_(
            self.page.locator("text=Welcome")
        ).first
        expect(welcome_element).to_be_visible(timeout=5000)
        return self

    def go_to_invoices(self):
        link = self.page.locator('a[href*="invoices"]').or_(self.page.locator('text=Invoices')).first
        link.click()
        from .invoices_page import InvoicesPage
        invoices = InvoicesPage(self.page, self.base_url)
        invoices.assert_loaded()
        return invoices

    def go_to_upload(self):
        link = self.page.locator('a[href*="upload"]').or_(self.page.locator('text=Upload')).first
        link.click()
        from .upload_page import UploadPage
        upload = UploadPage(self.page, self.base_url)
        upload.assert_loaded()
        return upload

    def go_to_dashboard(self):
        self.page.goto(f"{self.base_url}/dashboard")
        return self.assert_loaded()

    def logout(self):
        logout_btn = self.page.locator(
            'button:has-text("Logout"), button:has-text("Sign out"), a:has-text("Logout")'
        ).first
        logout_btn.click()
        from .login_page import LoginPage
        login_page = LoginPage(self.page, self.base_url)
        login_page.assert_loaded()
        return login_page
