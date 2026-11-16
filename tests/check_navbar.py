from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 800})
    page.goto('http://127.0.0.1:8000')
    page.wait_for_load_state('networkidle')
    
    # Click schemes nav button
    schemes_btn = page.locator("[data-testid='nav-schemes']").first
    schemes_btn.click()
    page.wait_for_timeout(1000)
    
    # Get bounding box of header and active button
    header_box = page.locator('header').bounding_box()
    btn_box = schemes_btn.bounding_box()
    
    print('Header box:', header_box)
    print('Button box:', btn_box)
    
    # Ensure button is strictly inside header
    assert btn_box['y'] >= header_box['y'], 'Button overflows top of header!'
    assert (btn_box['y'] + btn_box['height']) <= (header_box['y'] + header_box['height']), 'Button overflows bottom of header!'
    
    # Take screenshot of header
    page.locator('header').screenshot(path='navbar_fixed.png')
    print('SUCCESS! Button height is:', btn_box['height'], 'and it fits perfectly inside the header.')
    browser.close()
