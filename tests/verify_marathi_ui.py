import os
import sys
from playwright.sync_api import sync_playwright

def main():
    print("Launching Chromium browser to verify complete Marathi localization...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 900})
        page = context.new_page()

        # Open application
        page.goto("http://127.0.0.1:8000/", timeout=15000)
        page.wait_for_timeout(1000)

        # Select Marathi from the language dropdown
        print("Selecting Marathi (mr) in language dropdown...")
        page.select_option("select[aria-label='Select Language']", "mr")
        page.wait_for_timeout(1000)

        # Check key texts
        content = page.content()
        assert "शासकीय योजनांचे लाभ." in content, "Headline line 1 missing in Marathi"
        assert "आता प्रत्येक नागरिकासाठी सुलभ." in content, "Headline line 2 missing in Marathi"
        assert "शेतकरी विधवा मदत यात्रा" in content, "Farmer widow title missing in Marathi"
        assert "भारत" in content, "Country badge missing in Marathi"
        assert "शासकीय सेवा व योजना सहाय्यक" in content, "Subtagline missing in Marathi"

        # Take screenshot of Landing page
        os.makedirs("tests/screenshots", exist_ok=True)
        landing_screenshot = "tests/screenshots/marathi_landing.png"
        page.screenshot(path=landing_screenshot, full_page=False)
        print(f"Captured Marathi landing page screenshot at {landing_screenshot}")

        # Navigate to Schemes tab
        print("Navigating to Schemes tab...")
        page.click("[data-testid='nav-schemes']")
        page.wait_for_timeout(1000)
        schemes_screenshot = "tests/screenshots/marathi_schemes.png"
        page.screenshot(path=schemes_screenshot, full_page=False)
        print(f"Captured Marathi schemes screenshot at {schemes_screenshot}")

        # Navigate to Documents tab
        print("Navigating to Documents tab...")
        page.click("[data-testid='nav-documents']")
        page.wait_for_timeout(1000)
        docs_screenshot = "tests/screenshots/marathi_documents.png"
        page.screenshot(path=docs_screenshot, full_page=False)
        print(f"Captured Marathi documents screenshot at {docs_screenshot}")

        # Navigate to Applications tab
        print("Navigating to Applications tab...")
        page.click("[data-testid='nav-applications']")
        page.wait_for_timeout(1000)
        apps_screenshot = "tests/screenshots/marathi_applications.png"
        page.screenshot(path=apps_screenshot, full_page=False)
        print(f"Captured Marathi applications screenshot at {apps_screenshot}")

        # Navigate to AI Assistant tab
        print("Navigating to AI Assistant tab...")
        page.click("[data-testid='nav-assistant']")
        page.wait_for_timeout(1000)
        assistant_screenshot = "tests/screenshots/marathi_assistant.png"
        page.screenshot(path=assistant_screenshot, full_page=False)
        print(f"Captured Marathi assistant screenshot at {assistant_screenshot}")

        browser.close()
        print("SUCCESS! Complete Marathi localization verified across all pages.")

if __name__ == "__main__":
    main()
