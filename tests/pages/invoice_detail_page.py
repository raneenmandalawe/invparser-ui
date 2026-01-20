from playwright.sync_api import expect

from .base_page import BasePage


class InvoiceDetailPage(BasePage):
    invoice_detail = '[class*="invoice"], text=/Invoice|Details/i'

    def assert_loaded(self):
        self.page.wait_for_url("**/invoice/**", timeout=5000)
        expect(self.page.locator(self.invoice_detail).first).to_be_visible(timeout=5000)
        return self

    def go_back_to_invoices(self):
        back_button = self.page.locator('button:has-text("Back"), a:has-text("Back")').first
        if back_button.count() > 0:
            back_button.click()
        from .invoices_page import InvoicesPage
        return InvoicesPage(self.page, self.base_url)
