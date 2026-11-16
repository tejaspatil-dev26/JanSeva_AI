import time
import requests
from playwright.sync_api import sync_playwright

def run_test():
    url = "http://127.0.0.1:8000"
    print("\n--- Starting End-to-End GovTech Verification Test ---")
    
    # 1. Verify health
    r = requests.get(f"{url}/health")
    assert r.status_code == 200, "Server not healthy"
    print("Health check OK: Server is live.")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Step 1: Open Homepage
        page.goto(url)
        page.wait_for_load_state("networkidle")
        page.select_option("select[aria-label='Select Language']", "en")
        time.sleep(1)
        assert "JanSeva" in page.title()
        print("Step 1 Passed: JanSeva AI Homepage Loaded in English.")

        # Step 2: Check headline
        content = page.content()
        assert "Government Benefits" in content
        print("Step 2 Passed: Hero Headline Verified.")

        # Step 3: Click the Farmer's Widow Journey banner
        widow_btn = page.locator("text=Try the Farmer's Widow Journey").first
        assert widow_btn.is_visible()
        widow_btn.click()
        time.sleep(1)
        print("Step 3 Passed: Launched Farmer's Widow Journey.")

        # Step 4: Verify AI Assistant page loaded
        page.wait_for_selector("[data-testid='nav-assistant']")
        print("Step 4 Passed: AI Government Assistant Connected.")

        # Step 5: Navigate to Documents Tab via data-testid
        page.click("[data-testid='nav-documents']")
        time.sleep(1)
        page.wait_for_selector("[data-testid='sample-death-cert']")
        print("Step 5 Passed: Document Vault Loaded.")

        # Step 6: Click instant sample Death Certificate
        page.click("[data-testid='sample-death-cert']")
        time.sleep(1.5)
        
        # Verify OCR extraction
        page.wait_for_selector("text=Tukaram Pandurang Patil")
        assert "Tukaram Pandurang Patil" in page.content()
        print("Step 6 Passed: Death Certificate OCR Extracted Deceased Name.")

        # Step 7: Click instant sample 7/12 Land Record
        page.click("[data-testid='sample-land-record']")
        time.sleep(1.5)
        assert "Gat No. 204/A" in page.content()
        print("Step 7 Passed: 7/12 Land Record OCR Extracted Survey Number.")

        # Step 8: Navigate to Schemes Tab via data-testid
        page.click("[data-testid='nav-schemes']")
        time.sleep(1)
        page.wait_for_selector("[data-testid='btn-apply-scheme']")
        print("Step 8 Passed: Scheme Discovery Catalog Loaded.")

        # Step 9: Click Apply Now on Sanjay Gandhi Niradhar
        page.click("[data-testid='btn-apply-scheme']")
        time.sleep(1)

        # Step 10: Application Wizard
        page.wait_for_selector("[data-testid='wizard-continue']")
        print("Step 9 Passed: Application Preparation Wizard Opened.")

        # Step 1: Checklist -> Continue
        page.click("[data-testid='wizard-continue']")
        time.sleep(0.5)

        # Step 2: Review Fields -> Continue
        page.click("[data-testid='wizard-continue']")
        time.sleep(0.5)

        # Step 3: Consent & Declaration
        page.wait_for_selector("[data-testid='wizard-consent']")
        page.check("[data-testid='wizard-consent']")
        time.sleep(0.5)

        # Click Authorize & Submit
        page.click("[data-testid='wizard-submit']")
        time.sleep(3.5)

        # Step 4: Verify Success Acknowledgment
        page.wait_for_selector("[data-testid='wizard-track']")
        page_content = page.content()
        assert "MH-REV-WID" in page_content
        print("Step 10 Passed: Application Successfully Submitted with Official Ack ID!")

        # Step 11: Click Track in Applications Dashboard
        page.click("[data-testid='wizard-track']")
        time.sleep(1)

        assert "MH-REV-WID" in page.content()
        print("Step 11 Passed: Applications Tracking Dashboard Verified!")

        # Step 12: Test MahaSeva Portal Gateway tab
        page.click("[data-testid='nav-mock-portal']")
        time.sleep(1)
        page.wait_for_selector("text=MahaSeva Government Digital Gateway")
        print("Step 12 Passed: Official MahaSeva Testbed Gateway Verified!")

        # Step 13: Test Admin Dashboard tab
        page.click("[data-testid='nav-admin']")
        time.sleep(1)
        page.wait_for_selector("text=District Administration & Portal Oversight")
        print("Step 13 Passed: Admin Console & Audit Log Verified!")

        browser.close()
        print("\n*** ALL 13 END-TO-END DEMONSTRATION STEPS PASSED SUCCESSFULLY! ***\n")

if __name__ == "__main__":
    run_test()
