from playwright.sync_api import expect

from .base_page import BasePage


class UploadPage(BasePage):
    dropzone_css = '[class*="dropzone"]'
    file_input = 'input[type="file"]'

    def assert_loaded(self):
        self.page.wait_for_url("**/upload", timeout=5000)
        # Check for dropzone or file input - use .or_() for multiple options
        upload_element = self.page.locator(self.dropzone_css).or_(
            self.page.locator(self.file_input)
        ).first
        expect(upload_element).to_be_visible(timeout=5000)
        return self

    def upload_file(self, file_path: str):
        file_input = self.page.locator(self.file_input).first
        file_input.set_input_files(file_path)
        return self
