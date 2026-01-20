from playwright.sync_api import expect

from .base_page import BasePage


class InvoicesPage(BasePage):
    table_locator = 'table, [role="table"]'
    row_locator = 'tbody tr, [role="row"]'

    def assert_loaded(self):
        self.page.wait_for_url("**/invoices", timeout=5000)
        expect(self.page.locator(self.table_locator).first).to_be_visible(timeout=5000)
        return self

    def open_first_invoice(self):
        self.page.wait_for_timeout(500)
        first_row = self.page.locator(self.row_locator).first
        if first_row.count() > 0:
            first_row.click()
        return self.page.url
