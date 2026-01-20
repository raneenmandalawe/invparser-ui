import os
from playwright.sync_api import Page, expect


DEFAULT_APP_URL = os.getenv("APP_URL", "http://localhost:3000")


class BasePage:
    def __init__(self, page: Page, base_url: str = DEFAULT_APP_URL):
        self.page = page
        self.base_url = base_url

    def goto(self, path: str):
        self.page.goto(f"{self.base_url}{path}")
        return self

    def expect_url_fragment(self, fragment: str, timeout: int = 5000):
        expect(self.page).to_have_url(f"**/{fragment}*", timeout=timeout)
        return self
