from playwright.sync_api import sync_playwright
import time
from datetime import datetime, timedelta

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        try:
            # 1. Start backend (assumed running or start it)
            # 2. Add Customer
            page.goto("http://localhost:5000/customers")
            page.wait_for_load_state("networkidle")
            page.get_by_role("button", name="新增客戶").click()
            page.get_by_placeholder("姓名").fill("王五")
            page.get_by_placeholder("身分證字號").fill("C333333333")
            page.get_by_role("button", name="儲存").click()
            time.sleep(1)

            # 3. Add Item with expiry in 3 days
            page.goto("http://localhost:5000/items/add")
            page.get_by_role("combobox").select_option(label="王五 (C333333333)")
            page.get_by_label("物品名稱").fill("愛彼手錶")
            page.get_by_label("特徵描述").fill("皇家橡樹系列")
            page.get_by_label("核貸金額").fill("800000")

            expiry = (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d")
            page.get_by_label("滿當日期").fill(expiry)

            page.get_by_role("button", name="確認登錄物品").click()
            time.sleep(1)

            # 4. Check Dashboard for red alert
            page.goto("http://localhost:5000/")
            page.wait_for_load_state("networkidle")
            page.screenshot(path="verification/final_dashboard_check.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run_verification()
